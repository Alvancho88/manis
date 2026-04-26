// Centralized food data with full nutrition info including fat and sodium
// Thresholds based on health guidelines for elderly (per serving):
// - Fat: Low ≤5g, Medium 6-15g, High ≥16g
// - Sodium: Low ≤300mg, Medium 301-600mg, High ≥601mg
// - Sugar: Low ≤5g, Medium 6-15g, High ≥16g
// - GI: Low ≤55, Medium 56-69, High ≥70

export type FoodItem = {
  name: string
  category: string
  image: string
  calories: string
  sugar: string
  gi: string
  fat: string
  sodium: string
  portion: string
  risk: "low" | "medium" | "high"
  tip: { en: string; ms: string; zh: string }
}

export const allFoods: FoodItem[] = [
  // Malaysian
  { name: "Nasi Lemak", category: "Malaysian", image: "/images/food-nasi-lemak.jpg", calories: "644", sugar: "8g", gi: "64", fat: "25g", sodium: "850mg", portion: "1 plate (350g)", risk: "medium", tip: { en: "High fat and sodium. Enjoy smaller portions, less sambal.", ms: "Lemak dan natrium tinggi. Nikmati bahagian lebih kecil, kurang sambal.", zh: "高脂肪高钠。少量食用，减少参巴酱。" } },
  { name: "Roti Canai", category: "Malaysian", image: "/images/food-roti-canai.jpg", calories: "301", sugar: "4g", gi: "82", fat: "12g", sodium: "450mg", portion: "2 pieces", risk: "high", tip: { en: "High GI, moderate fat. Eat less often. Choose dhal over curry.", ms: "GI tinggi, lemak sederhana. Makan kurang kerap. Pilih dhal berbanding kari.", zh: "高GI，中等脂肪。少吃。选扁豆而非咖喱。" } },
  { name: "Mee Goreng", category: "Malaysian", image: "/images/food-mee-goreng.jpg", calories: "660", sugar: "5g", gi: "60", fat: "22g", sodium: "1200mg", portion: "1 plate (350g)", risk: "medium", tip: { en: "Very high sodium! Add more vegetables, request less oil and soy sauce.", ms: "Natrium sangat tinggi! Tambah sayuran, minta kurang minyak dan kicap.", zh: "钠含量很高！多加蔬菜，要求少油少酱油。" } },
  { name: "Laksa", category: "Malaysian", image: "/images/food-laksa.jpg", calories: "589", sugar: "6g", gi: "58", fat: "28g", sodium: "1450mg", portion: "1 bowl (400g)", risk: "high", tip: { en: "Very high fat and sodium from coconut milk and broth. Limit portion.", ms: "Lemak dan natrium tinggi dari santan dan kuah. Hadkan bahagian.", zh: "椰浆和汤汁导致高脂肪高钠。控制份量。" } },
  { name: "Char Kway Teow", category: "Malaysian", image: "/images/food-char-kway-teow.jpg", calories: "742", sugar: "4g", gi: "65", fat: "35g", sodium: "1100mg", portion: "1 plate (350g)", risk: "high", tip: { en: "Very high fat and sodium. Enjoy occasionally, share with others.", ms: "Lemak dan natrium sangat tinggi. Nikmati sekali-sekala, kongsi dengan orang lain.", zh: "脂肪和钠含量很高。偶尔享用，与他人分享。" } },
  { name: "Nasi Goreng", category: "Malaysian", image: "/images/food-nasi-goreng.jpg", calories: "625", sugar: "5g", gi: "68", fat: "20g", sodium: "980mg", portion: "1 plate (350g)", risk: "medium", tip: { en: "High sodium from soy sauce. Ask for less oil and sauce.", ms: "Natrium tinggi dari kicap. Minta kurang minyak dan sos.", zh: "酱油导致高钠。要求少油少酱。" } },
  { name: "Satay (6 sticks)", category: "Malaysian", image: "/images/food-satay.jpg", calories: "330", sugar: "8g", gi: "45", fat: "18g", sodium: "520mg", portion: "6 sticks with sauce", risk: "medium", tip: { en: "Grilled meat is good, but limit peanut sauce. High fat from sauce.", ms: "Daging panggang bagus, tetapi hadkan kuah kacang. Lemak tinggi dari kuah.", zh: "烤肉不错，但要限制花生酱。酱料脂肪高。" } },
  { name: "Rendang", category: "Malaysian", image: "/images/food-rendang.jpg", calories: "468", sugar: "3g", gi: "35", fat: "32g", sodium: "680mg", portion: "1 serving (150g)", risk: "medium", tip: { en: "High fat from coconut milk. Good protein but eat in moderation.", ms: "Lemak tinggi dari santan. Protein bagus tetapi makan sederhana.", zh: "椰浆导致高脂肪。蛋白质好但要适量。" } },

  // Chinese
  { name: "Chicken Rice", category: "Chinese", image: "/images/food-brown-rice.jpg", calories: "702", sugar: "6g", gi: "65", fat: "24g", sodium: "890mg", portion: "1 plate (350g)", risk: "medium", tip: { en: "Choose steamed over roasted. High fat from chicken skin and rice oil.", ms: "Pilih kukus berbanding panggang. Lemak tinggi dari kulit ayam dan minyak nasi.", zh: "选蒸鸡而非烤鸡。鸡皮和饭油脂肪高。" } },
  { name: "Wonton Noodles", category: "Chinese", image: "/images/food-wonton-noodles.jpg", calories: "520", sugar: "4g", gi: "55", fat: "15g", sodium: "1050mg", portion: "1 bowl (350g)", risk: "medium", tip: { en: "High sodium from broth and soy sauce. Choose dry version if possible.", ms: "Natrium tinggi dari kuah dan kicap. Pilih versi kering jika boleh.", zh: "汤和酱油钠高。可以的话选干捞版。" } },
  { name: "Dim Sum (6 pcs)", category: "Chinese", image: "/images/food-dim-sum.jpg", calories: "480", sugar: "5g", gi: "58", fat: "22g", sodium: "850mg", portion: "6 pieces mixed", risk: "medium", tip: { en: "Choose steamed over fried. Watch portion size and dipping sauce.", ms: "Pilih kukus berbanding goreng. Perhatikan saiz bahagian dan sos celup.", zh: "选蒸的而非炸的。注意份量和蘸酱。" } },
  { name: "Fried Rice", category: "Chinese", image: "/images/food-fried-rice.jpg", calories: "580", sugar: "3g", gi: "70", fat: "18g", sodium: "920mg", portion: "1 plate (300g)", risk: "high", tip: { en: "High GI and sodium. Request less oil and soy sauce when ordering.", ms: "GI dan natrium tinggi. Minta kurang minyak dan kicap semasa pesan.", zh: "高GI高钠。点餐时要求少油少酱油。" } },
  { name: "Steamed Fish", category: "Chinese", image: "/images/food-steamed-fish.jpg", calories: "280", sugar: "2g", gi: "0", fat: "8g", sodium: "650mg", portion: "1 serving (200g)", risk: "low", tip: { en: "Excellent choice! Low fat, high protein. Watch the soy sauce.", ms: "Pilihan hebat! Rendah lemak, tinggi protein. Perhatikan kicap.", zh: "极佳选择！低脂高蛋白。注意酱油用量。" } },
  { name: "Bak Kut Teh", category: "Chinese", image: "/images/food-bak-kut-teh.jpg", calories: "450", sugar: "2g", gi: "25", fat: "28g", sodium: "1200mg", portion: "1 bowl (400g)", risk: "medium", tip: { en: "Very high sodium from broth. High fat from pork. Limit soup intake.", ms: "Natrium sangat tinggi dari kuah. Lemak tinggi dari babi. Hadkan sup.", zh: "汤汁钠含量很高。猪肉脂肪高。限制喝汤。" } },

  // Indian
  { name: "Thosai", category: "Indian", image: "/images/food-thosai.jpg", calories: "120", sugar: "1g", gi: "70", fat: "3g", sodium: "180mg", portion: "1 piece", risk: "medium", tip: { en: "High GI but low fat. Choose sambar or dhal over coconut chutney.", ms: "GI tinggi tetapi rendah lemak. Pilih sambar atau dhal berbanding chutney kelapa.", zh: "高GI但低脂。选扁豆汤而非椰子酸辣酱。" } },
  { name: "Banana Leaf Rice", category: "Indian", image: "/images/food-banana-leaf.jpg", calories: "850", sugar: "8g", gi: "72", fat: "30g", sodium: "1100mg", portion: "1 serving", risk: "high", tip: { en: "Very high in calories, fat, sodium. Take smaller portions of rice and curry.", ms: "Sangat tinggi kalori, lemak, natrium. Ambil bahagian kecil nasi dan kari.", zh: "热量、脂肪、钠都很高。少量米饭和咖喱。" } },
  { name: "Dhal Curry", category: "Indian", image: "/images/food-dhal.jpg", calories: "180", sugar: "4g", gi: "42", fat: "6g", sodium: "380mg", portion: "1 cup (200g)", risk: "low", tip: { en: "Good protein source with low GI. A healthy curry option.", ms: "Sumber protein baik dengan GI rendah. Pilihan kari sihat.", zh: "低GI的良好蛋白质来源。健康的咖喱选择。" } },
  { name: "Briyani", category: "Indian", image: "/images/food-briyani.jpg", calories: "720", sugar: "5g", gi: "68", fat: "28g", sodium: "920mg", portion: "1 plate (400g)", risk: "medium", tip: { en: "High fat from ghee and meat. Share portion or take less rice.", ms: "Lemak tinggi dari ghee dan daging. Kongsi bahagian atau ambil kurang nasi.", zh: "酥油和肉导致高脂肪。分享或少要米饭。" } },

  // Western
  { name: "Grilled Chicken Breast", category: "Western", image: "/images/food-grilled-chicken.jpg", calories: "280", sugar: "0g", gi: "0", fat: "6g", sodium: "420mg", portion: "1 piece (150g)", risk: "low", tip: { en: "Excellent lean protein choice! Avoid creamy sauces.", ms: "Pilihan protein tanpa lemak yang hebat! Elakkan sos berkrim.", zh: "极佳的瘦肉蛋白选择！避免奶油酱。" } },
  { name: "Fish & Chips", category: "Western", image: "/images/food-fish-chips.jpg", calories: "850", sugar: "2g", gi: "75", fat: "45g", sodium: "780mg", portion: "1 serving", risk: "high", tip: { en: "Very high fat from deep frying. Choose grilled fish instead.", ms: "Lemak sangat tinggi dari gorengan. Pilih ikan panggang.", zh: "油炸导致脂肪很高。选择烤鱼。" } },
  { name: "Caesar Salad", category: "Western", image: "/images/food-caesar-salad.jpg", calories: "380", sugar: "4g", gi: "15", fat: "28g", sodium: "720mg", portion: "1 bowl (250g)", risk: "medium", tip: { en: "High fat from dressing and cheese. Ask for dressing on the side.", ms: "Lemak tinggi dari sos dan keju. Minta sos berasingan.", zh: "酱料和奶酪脂肪高。要求酱料另放。" } },
  { name: "Spaghetti Bolognese", category: "Western", image: "/images/food-spaghetti.jpg", calories: "620", sugar: "8g", gi: "55", fat: "18g", sodium: "850mg", portion: "1 plate (350g)", risk: "medium", tip: { en: "Moderate choice. Ask for whole wheat pasta and less cheese.", ms: "Pilihan sederhana. Minta pasta gandum dan kurang keju.", zh: "中等选择。要求全麦意面和少奶酪。" } },

  // Japanese
  { name: "Sushi (8 pcs)", category: "Japanese", image: "/images/food-sushi.jpg", calories: "350", sugar: "8g", gi: "65", fat: "4g", sodium: "680mg", portion: "8 pieces", risk: "low", tip: { en: "Good choice! Low fat. Watch soy sauce for sodium.", ms: "Pilihan bagus! Rendah lemak. Perhatikan kicap untuk natrium.", zh: "好选择！低脂。注意酱油钠含量。" } },
  { name: "Ramen", category: "Japanese", image: "/images/food-ramen.jpg", calories: "680", sugar: "4g", gi: "58", fat: "22g", sodium: "1800mg", portion: "1 bowl (500g)", risk: "high", tip: { en: "Very high sodium! Don't drink all the broth. Choose less fatty cuts.", ms: "Natrium sangat tinggi! Jangan minum semua kuah. Pilih potongan kurang berlemak.", zh: "钠含量很高！不要喝完汤。选择较瘦的肉。" } },
  { name: "Teriyaki Chicken", category: "Japanese", image: "/images/food-teriyaki.jpg", calories: "420", sugar: "12g", gi: "50", fat: "14g", sodium: "920mg", portion: "1 serving (200g)", risk: "medium", tip: { en: "Sugar in sauce adds up. Ask for less sauce.", ms: "Gula dalam sos bertambah. Minta kurang sos.", zh: "酱料含糖。要求少酱。" } },

  // Korean
  { name: "Bibimbap", category: "Korean", image: "/images/food-bibimbap.jpg", calories: "550", sugar: "6g", gi: "62", fat: "15g", sodium: "780mg", portion: "1 bowl (400g)", risk: "medium", tip: { en: "Good vegetables! Go easy on the gochujang sauce and egg yolk.", ms: "Sayuran bagus! Kurangkan sos gochujang dan kuning telur.", zh: "蔬菜好！少放辣酱和蛋黄。" } },
  { name: "Korean Fried Chicken", category: "Korean", image: "/images/food-korean-chicken.jpg", calories: "650", sugar: "18g", gi: "45", fat: "35g", sodium: "1100mg", portion: "6 pieces", risk: "high", tip: { en: "High fat, sugar, sodium from sauce. Limit to 2-3 pieces.", ms: "Lemak, gula, natrium tinggi dari sos. Hadkan kepada 2-3 keping.", zh: "酱料导致高脂高糖高钠。限制2-3����。" } },
  { name: "Kimchi Jjigae", category: "Korean", image: "/images/food-kimchi-jjigae.jpg", calories: "380", sugar: "5g", gi: "35", fat: "16g", sodium: "1350mg", portion: "1 bowl (350g)", risk: "medium", tip: { en: "Very high sodium from kimchi and broth. Good protein from tofu.", ms: "Natrium sangat tinggi dari kimchi dan kuah. Protein baik dari tauhu.", zh: "泡菜和汤汁钠很高。豆腐蛋白质好。" } },

  // Desserts
  { name: "Cendol", category: "Desserts", image: "/images/food-cendol.jpg", calories: "380", sugar: "42g", gi: "78", fat: "12g", sodium: "45mg", portion: "1 bowl", risk: "high", tip: { en: "Very high sugar from gula melaka. Avoid or limit to few spoonfuls.", ms: "Gula sangat tinggi dari gula melaka. Elakkan atau hadkan kepada beberapa sudu.", zh: "椰糖含糖量极高。避免或只吃几勺。" } },
  { name: "Apam Balik", category: "Desserts", image: "/images/food-apam-balik.jpg", calories: "320", sugar: "28g", gi: "75", fat: "10g", sodium: "180mg", portion: "1 piece", risk: "high", tip: { en: "High sugar from filling. Share with others or eat half.", ms: "Gula tinggi dari inti. Kongsi atau makan separuh.", zh: "馅料含糖高。与他人分享或只吃一半。" } },
  { name: "Kuih Lapis", category: "Desserts", image: "/images/food-kuih-lapis.jpg", calories: "180", sugar: "15g", gi: "68", fat: "6g", sodium: "35mg", portion: "2 pieces", risk: "medium", tip: { en: "Moderate sugar. Limit to 1-2 pieces only.", ms: "Gula sederhana. Hadkan kepada 1-2 keping sahaja.", zh: "糖分中等。限制1-2块。" } },
  { name: "Ice Cream", category: "Desserts", image: "/images/food-ice-cream.jpg", calories: "270", sugar: "24g", gi: "62", fat: "14g", sodium: "80mg", portion: "1 scoop (100g)", risk: "high", tip: { en: "High sugar and fat. Choose fruit sorbet instead.", ms: "Gula dan lemak tinggi. Pilih sorbet buah.", zh: "高糖高脂。选择水果冰沙。" } },
  { name: "Fresh Fruits", category: "Desserts", image: "/images/food-fruits.jpg", calories: "80", sugar: "12g", gi: "40", fat: "0g", sodium: "5mg", portion: "1 cup (150g)", risk: "low", tip: { en: "Best dessert choice! Natural sugars with fiber.", ms: "Pilihan pencuci mulut terbaik! Gula semula jadi dengan serat.", zh: "最佳甜点！天然糖分配纤维。" } },

  // Drinks
  { name: "Teh Tarik", category: "Drinks", image: "/images/food-teh-tarik.jpg", calories: "120", sugar: "18g", gi: "65", fat: "4g", sodium: "35mg", portion: "1 glass (200ml)", risk: "medium", tip: { en: "Ask for 'kurang manis'. Condensed milk adds sugar and fat.", ms: "Minta 'kurang manis'. Susu pekat menambah gula dan lemak.", zh: "要求'少甜'。炼乳增加糖和脂肪。" } },
  { name: "Kopi O Kosong", category: "Drinks", image: "/images/food-kopi.jpg", calories: "5", sugar: "0g", gi: "0", fat: "0g", sodium: "5mg", portion: "1 cup (200ml)", risk: "low", tip: { en: "Perfect choice! Zero sugar, zero fat.", ms: "Pilihan sempurna! Sifar gula, sifar lemak.", zh: "完美选择！零糖零脂。" } },
  { name: "Air Sirap", category: "Drinks", image: "/images/food-air-sirap.jpg", calories: "140", sugar: "35g", gi: "85", fat: "0g", sodium: "10mg", portion: "1 glass (250ml)", risk: "high", tip: { en: "Very high sugar syrup drink. Best avoided.", ms: "Minuman sirap sangat tinggi gula. Elakkan.", zh: "糖浆饮料含糖极高。最好避免。" } },
  { name: "Milo", category: "Drinks", image: "/images/food-milo.jpg", calories: "180", sugar: "22g", gi: "55", fat: "5g", sodium: "95mg", portion: "1 glass (250ml)", risk: "medium", tip: { en: "High sugar. Ask for less Milo and no condensed milk.", ms: "Gula tinggi. Minta kurang Milo dan tanpa susu pekat.", zh: "高糖。要求少放美禄，不加炼乳。" } },
  { name: "Fresh Coconut Water", category: "Drinks", image: "/images/food-coconut.jpg", calories: "45", sugar: "6g", gi: "35", fat: "0g", sodium: "250mg", portion: "1 glass (240ml)", risk: "low", tip: { en: "Natural electrolytes! Good hydration choice.", ms: "Elektrolit semula jadi! Pilihan hidrasi baik.", zh: "天然电解质！好的补水选择。" } },
  { name: "Plain Water", category: "Drinks", image: "/images/food-water.jpg", calories: "0", sugar: "0g", gi: "0", fat: "0g", sodium: "0mg", portion: "1 glass (250ml)", risk: "low", tip: { en: "The best drink! Stay hydrated.", ms: "Minuman terbaik! Kekal terhidrat.", zh: "最好的饮料！保持水分。" } },

  // Fruits
  { name: "Banana", category: "Fruits", image: "/images/food-banana.jpg", calories: "105", sugar: "14g", gi: "51", fat: "0g", sodium: "1mg", portion: "1 medium", risk: "low", tip: { en: "Good potassium source. Moderate sugar but natural.", ms: "Sumber kalium baik. Gula sederhana tetapi semula jadi.", zh: "好的钾来源。糖分中等但是天然的。" } },
  { name: "Papaya", category: "Fruits", image: "/images/food-papaya.jpg", calories: "62", sugar: "8g", gi: "60", fat: "0g", sodium: "4mg", portion: "1 cup (145g)", risk: "low", tip: { en: "Good fiber and vitamin C. Moderate GI.", ms: "Serat dan vitamin C bagus. GI sederhana.", zh: "好的纤维和维C。GI中等。" } },
  { name: "Watermelon", category: "Fruits", image: "/images/food-watermelon.jpg", calories: "46", sugar: "9g", gi: "72", fat: "0g", sodium: "2mg", portion: "1 cup (150g)", risk: "medium", tip: { en: "High GI but low calories. Eat in moderation.", ms: "GI tinggi tetapi rendah kalori. Makan sederhana.", zh: "GI高但热量低。适量食用。" } },
  { name: "Orange", category: "Fruits", image: "/images/food-orange.jpg", calories: "62", sugar: "12g", gi: "43", fat: "0g", sodium: "0mg", portion: "1 medium", risk: "low", tip: { en: "Great vitamin C! Low GI fruit.", ms: "Vitamin C hebat! Buah GI rendah.", zh: "维C丰富！低GI水果。" } },
  { name: "Mango", category: "Fruits", image: "/images/food-mango.jpg", calories: "99", sugar: "23g", gi: "56", fat: "1g", sodium: "2mg", portion: "1 cup (165g)", risk: "medium", tip: { en: "Higher sugar than other fruits. Limit portion.", ms: "Gula lebih tinggi berbanding buah lain. Hadkan bahagian.", zh: "比其他水果糖分高。控制份量。" } },
  { name: "Apple", category: "Fruits", image: "/images/food-apple.jpg", calories: "95", sugar: "19g", gi: "36", fat: "0g", sodium: "2mg", portion: "1 medium", risk: "low", tip: { en: "Low GI with good fiber. Eat with skin.", ms: "GI rendah dengan serat baik. Makan dengan kulit.", zh: "低GI高纤维。连皮吃。" } },
]

// Get level helpers
export function getSugarLevel(sugar: string): "low" | "medium" | "high" {
  const value = parseInt(sugar.replace(/[^0-9]/g, ''), 10)
  if (value <= 5) return "low"
  if (value <= 15) return "medium"
  return "high"
}

export function getGILevel(gi: string): "low" | "medium" | "high" {
  const value = parseInt(gi.replace(/[^0-9]/g, ''), 10)
  if (value <= 55) return "low"
  if (value <= 69) return "medium"
  return "high"
}

export function getFatLevel(fat: string): "low" | "medium" | "high" {
  const value = parseInt(fat.replace(/[^0-9]/g, ''), 10)
  if (value <= 5) return "low"
  if (value <= 15) return "medium"
  return "high"
}

export function getSodiumLevel(sodium: string): "low" | "medium" | "high" {
  const value = parseInt(sodium.replace(/[^0-9]/g, ''), 10)
  if (value <= 300) return "low"
  if (value <= 600) return "medium"
  return "high"
}

// Daily limits for elderly
export const dailyLimits = {
  sugar:   { men: 36,   women: 25,   unit: "g"    },
  fat:     { men: 78,   women: 62,   unit: "g"    }, // Based on ~2500 kcal men / ~2000 kcal women at 28% fat
  sodium:  { men: 2000, women: 2000, unit: "mg"   }, // WHO recommendation (same for both)
  cal:     { men: 2500, women: 2000, unit: "kcal" }, // Approximate daily energy needs
  gi:      { men: 55,   women: 55,   unit: ""     }, // Average GI target (low GI = ≤55)
}

// Categories
export const categories = {
  en: ["All", "Malaysian", "Chinese", "Indian", "Western", "Japanese", "Korean", "Desserts", "Drinks", "Fruits"],
  ms: ["Semua", "Malaysia", "Cina", "India", "Barat", "Jepun", "Korea", "Pencuci", "Minuman", "Buah"],
  zh: ["全部", "马来菜", "中餐", "印度菜", "西餐", "日式", "韩式", "甜点", "饮料", "水果"],
}
