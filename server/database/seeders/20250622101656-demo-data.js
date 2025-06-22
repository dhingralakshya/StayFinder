'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Listings', [
      {
        title: "Luxury Private Stay Near Temples & Ghats",
        description: "Namaste! Welcome to experience the world's oldest city: The eternal - Kashi, folks call it Banaras, officially city is known as Varanasi\n\nDive into the authentic experience of ancient Varanasi from our spacious comfy & luxury yet peaceful home that is entirely private floor for you where traditional culture meets comfort.\n\nWhether you’re an international traveller, bachelor, couple, or a family or senior citizen everyone is welcome :)\nThe space is\n* 400m from the Railway Station\n\n* 1km from Vishwanath Temple\n\n* 1.5km from the Ghats\n\n* 400m from famous food joints like Ram Bhandar, Kashi Chat Bhandaar etc\n\n*20mins from Airport\n\n* 250m from the Malls & Shopping Complex\n\n* 50m Famous Street Food & Restaurants\n\n* 50m Many famous eateries, cafes & restaurants\n\n* 10m Shops & Markets\n\n* 20m Laundry\n\n* 200m Scooty & Bike Rentals\n\n* Within 2km All famous touristy places\n\n* 24x7 easy public transport available.\nJust step out of the main gate and you'll find Auto Rickshaw/Tuktuk/ Cabs\n\n* Also if you'd like a private customized guided tour, just let us know in advance so we can get a reliable guide for you and so that dont get scammed and enjoy to the fullest\n\nAnd Yes, the snacks in the kitchen are complimentary FOR YOU :) Help yourselves!\n\n* Luggage Drop/Storage facility is Available (before checkin and after checkout)\n\n* If you want extra rooms or extend your booking please do let us know in advance.\n\nWander through lively by lanes, visit ancient temples, explore the historic ghats, and savour the local flavours of iconic Varanasi street foods — all just a stone's throw away!",
        price: 3800,
        location: "Varanasi",
        hostId: 1,
        imageUrls: [
            "https://ik.imagekit.io/ejzfsxdp8l/seedPhoto1_xad19yf6X9.avif",
            "https://ik.imagekit.io/ejzfsxdp8l/seedPhoto2_3pFAcpSzlx.avif",
            "https://ik.imagekit.io/ejzfsxdp8l/seedPhoto3__VPRT_o68.avif"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Cozy City Retreat | Luxury Stay | Omaxe | Lucknow",
        description: "Kick back and relax in this calm, stylish\nspace where comfort meets character. Stream your favorites on the 55” Google TV, soak up fresh air in the outdoor seating area, and rest on a plush king-size bed. A roomy wardrobe keeps things organized, while theme-based lighting adds a personalized touch to every moment.\nThe space\n12th floor studio apartment with a balcony view with proper seating arrangements. A king size bed and a 55\" inch LED TV. Place is couple-friendly. Local IDs are accepted.\nGuest access\nEntire place including balcony.\nOther things to note\nSnacks, extra water bottles, etc. are available as paid services.\n\nHousekeeping and cleaning services available in evening 4-6 pm, included with stay.",
        price: 2500,
        location: "Lucknow",
        hostId: 1,
        imageUrls: [
            "https://ik.imagekit.io/ejzfsxdp8l/seed2Photo1_H9GfBLv_M.avif",
            "https://ik.imagekit.io/ejzfsxdp8l/seed2Photo2_9IXZNDaZ2y.avif",
            "https://ik.imagekit.io/ejzfsxdp8l/seed2Photo3_3mnOOJAPV.avif"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Listings', null, {});
  }
};
