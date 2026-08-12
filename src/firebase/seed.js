import { db } from './config.js';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const mockProducts = [
  { name: 'Golden Fox Set', price: 20, category: 'set', description: 'Elegant golden fox set containing necklace, ring and earrings.', imageUrl: '/images/set1.jpg' },
  { name: 'Blessings Set', price: 20, category: 'set', description: 'Traditional blessings jewelry set.', imageUrl: '/images/set2.jpg' },
  { name: 'Lucky Set', price: 20, category: 'set', description: 'Lucky charms jewelry set.', imageUrl: '/images/set3.jpg' },
  { name: 'Wealthy Set', price: 20, category: 'set', description: 'Luxurious wealthy-themed jewelry set.', imageUrl: '/images/set4.jpg' },
  { name: 'Elegant Gold Diamond Ring', price: 114, category: 'ring', description: '18k gold diamond ring with exquisite details.', imageUrl: '/images/ring1.jpg' },
  { name: 'Delicate Gold Leaf Engagement Ring', price: 291, category: 'ring', description: 'Gold leaf engagement ring representing growth and eternity.', imageUrl: '/images/ring2.jpg' },
  { name: 'Floral Leafy Round Cut Ring', price: 160, category: 'ring', description: 'Round cut diamond ring with floral accents.', imageUrl: '/images/ring3.jpg' },
  { name: 'Round Diamond Ring', price: 185, category: 'ring', description: 'Classic solitaire round cut engagement diamond ring.', imageUrl: '/images/ring4.jpg' },
  { name: 'Butterfly Earrings', price: 90, category: 'earring', description: 'Beautiful gold butterfly drop earrings.', imageUrl: '/images/ear1.jpg' },
  { name: 'Aurora Huggies Earrings', price: 110, category: 'earring', description: 'Sparkling aurora huggies earrings.', imageUrl: '/images/ear2.jpg' },
  { name: 'Floral Earrings', price: 450, category: 'earring', description: 'Diamond floral studs in 18k white gold.', imageUrl: '/images/ear3.jpg' },
  { name: 'Cat’s Eye Stone Tassel Earrings', price: 321, category: 'earring', description: 'Exotic cat\'s eye stone drop earrings with tassels.', imageUrl: '/images/ear4.jpg' },
  { name: 'Elegant Gold Necklace', price: 500, category: 'necklace', description: 'Solid 24k gold chain link necklace.', imageUrl: '/images/nack1.jpg' },
  { name: 'Elegant Gold Pearl Necklace', price: 390, category: 'necklace', description: 'Stunning white freshwater pearl with gold accent chain.', imageUrl: '/images/nack2.jpg' },
  { name: 'Pear Diamond Necklace', price: 365, category: 'necklace', description: 'Pear cut sparkling diamond drop necklace.', imageUrl: '/images/nack3.jpg' },
  { name: 'Floral Necklace', price: 682, category: 'necklace', description: 'Extravagant floral diamond bib necklace.', imageUrl: '/images/nack4.jpg' },
  { name: 'Bamboo Style Bangle', price: 122, category: 'bangle', description: 'Chic bamboo-cut gold bangle.', imageUrl: '/images/b1.jpg' },
  { name: 'Flower Bangle', price: 90, category: 'bangle', description: 'Sweet flower-shaped charms gold bangle.', imageUrl: '/images/b2.jpg' },
  { name: 'Lotus Diamond Bangle', price: 256, category: 'bangle', description: 'Diamond embedded lotus pattern cuff bangle.', imageUrl: '/images/b3.jpg' },
  { name: 'Heart Shaped Bangle', price: 99, category: 'bangle', description: 'Romantic heart-shaped lock gold bangle.', imageUrl: '/images/b4.jpg' },
];

export async function seedProducts() {
  const querySnapshot = await getDocs(collection(db, 'jewelry'));
  
  // If the collection is empty OR if it has old unsplash placeholder products,
  // let's clear it and re-seed so we see the correct local assets.
  let needsSeed = querySnapshot.empty;
  
  if (!needsSeed) {
    // Check if the first item contains unsplash url, if so, reseed
    const firstDoc = querySnapshot.docs[0].data();
    if (firstDoc.imageUrl && firstDoc.imageUrl.includes('unsplash.com')) {
      console.log("Found old placeholder data. Clearing collection to re-seed...");
      for (const d of querySnapshot.docs) {
        await deleteDoc(doc(db, 'jewelry', d.id));
      }
      needsSeed = true;
    }
  }

  if (needsSeed) {
    console.log("Seeding products with local image URLs...");
    for (const prod of mockProducts) {
      await addDoc(collection(db, 'jewelry'), {
        ...prod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    console.log("Seeding finished.");
  }
}
