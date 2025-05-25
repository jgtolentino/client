import json
import random
from datetime import datetime, timedelta

# Load your real brands list (from brands_500.json)
with open('attached_assets/brands_500.json', 'r') as f:
    brand_records = json.load(f)

# Build a list of unique brands (with frequency weight by occurrence)
brands_unique = list({rec['brand'] for rec in brand_records})
brand_weights = {brand: 1 for brand in brands_unique}
for rec in brand_records:
    brand_weights[rec['brand']] += 1

# Optionally, you can define categories if needed
category_map = {
    "Oishi": "Snacks",
    "Jack 'n Jill": "Snacks",
    "Del Monte": "Beverages",
    "Surf": "Household",
    "Birch Tree": "Dairy",
    "Lucky Me!": "Noodles",
    "Palmolive": "Personal Care",
    "Marlboro": "Cigarettes",
    "Winston": "Cigarettes",
    "Coca-Cola": "Beverages",
    "Nestlé": "Food & Beverage",
    "Unilever": "Personal Care",
    "P&G": "Household",
    "Colgate": "Personal Care",
    "Kopiko": "Beverages",
    "Rebisco": "Snacks",
    "CDO": "Food",
    "San Miguel": "Beverages",
    "Alaska": "Dairy",
    "Monde": "Snacks",
    "Pride": "Household",
    "Champion": "Household",
    "Downy": "Household",
    "Tide": "Household",
    "Ariel": "Household",
    "Safeguard": "Personal Care",
    "Dove": "Personal Care",
    "Nescafe": "Beverages",
    "Bear Brand": "Dairy",
    "Magnolia": "Dairy",
    "Purefoods": "Food",
    "Tender Juicy": "Food",
    "Argentina": "Food",
    "Century": "Food",
    "Ligo": "Food",
    "555": "Food",
    "Mega": "Food",
    "Spam": "Food",
    "Milo": "Beverages",
    "Ovaltine": "Beverages",
    "Tang": "Beverages",
    "Eight O'Clock": "Beverages",
    "Great Taste": "Beverages",
    "Cream-O": "Snacks",
    "Skyflakes": "Snacks",
    "Fita": "Snacks",
    "Chippy": "Snacks",
    "Clover": "Snacks",
    "Nissin": "Noodles",
    "Yakisoba": "Noodles",
    "Payless": "Noodles",
    "Magic": "Condiments",
    "Knorr": "Condiments",
    "Maggi": "Condiments",
    "Ajinomoto": "Condiments",
    "Silver Swan": "Condiments",
    "Datu Puti": "Condiments",
    "UFC": "Condiments",
    "Papa": "Condiments",
    "Lorins": "Condiments",
    "Clara Ole": "Condiments"
}

# Enhanced category keywords for better matching
category_keywords = {
    "Snacks": ["Chips", "Crackers", "Biscuit", "Cookie", "Pretzel", "Popcorn"],
    "Beverages": ["Juice", "Coffee", "Tea", "Soda", "Drink", "Water"],
    "Food": ["Meat", "Corned", "Tuna", "Sardines", "Loaf", "Sausage"],
    "Household": ["Detergent", "Soap", "Cleaner", "Fabric", "Dishwashing"],
    "Personal Care": ["Shampoo", "Toothpaste", "Deodorant", "Lotion", "Cream"],
    "Dairy": ["Milk", "Cheese", "Yogurt", "Butter"],
    "Noodles": ["Instant", "Pancit", "Pasta", "Spaghetti"],
    "Condiments": ["Sauce", "Vinegar", "Soy", "Ketchup", "Mayo"]
}

def assign_category(brand):
    # First check exact brand mapping
    for key in category_map:
        if key.lower() in brand.lower():
            return category_map[key]
    
    # Then check category keywords
    brand_lower = brand.lower()
    for category, keywords in category_keywords.items():
        for keyword in keywords:
            if keyword.lower() in brand_lower:
                return category
    
    # Default categories based on common patterns
    if any(word in brand_lower for word in ["sweet", "candy", "gum", "chocolate"]):
        return "Confectionery"
    elif any(word in brand_lower for word in ["oil", "butter", "margarine"]):
        return "Cooking Essentials"
    elif any(word in brand_lower for word in ["diaper", "tissue", "napkin"]):
        return "Paper Products"
    elif any(word in brand_lower for word in ["vitamin", "medicine", "supplement"]):
        return "Health & Wellness"
    
    return "Grocery Items"  # More specific than "General"

N = 500  # number of records per main section

# --- Transaction Trends ---
transaction_trends = []
start_date = datetime(2025, 4, 24)
for i in range(N):
    rec = random.choice(brand_records)
    brand = rec['brand']
    category = assign_category(brand)
    date_offset = random.randint(0, 29)
    ts = start_date + timedelta(days=date_offset)
    transaction_trends.append({
        "date": ts.strftime("%Y-%m-%d"),
        "volume": random.randint(500, 2500),
        "peso_value": round(rec['value'], 2),
        "duration": random.randint(30, 300),  # seconds
        "units": random.randint(1, 10),
        "brand": brand,
        "category": category
    })

# --- Consumer Profiling ---
consumer_profiling = []
locations = ["Manila", "Cebu", "Davao", "Bacolod", "Makati", "Taguig", "Quezon City", "Iloilo", "Cagayan de Oro", "Zamboanga"]
for i in range(N):
    consumer_profiling.append({
        "gender": random.choice(["Male", "Female"]),
        "age": random.randint(18, 65),
        "location": random.choice(locations)
    })

# --- Basket Analysis ---
basket_data = []
for i in range(N):
    brand = random.choice(brands_unique)
    basket_data.append({
        "basket_id": f"BASKET{i+1:04d}",
        "brand": brand,
        "item_count": random.randint(1, 7),
        "total_value": round(random.uniform(50, 1800), 2)
    })

# --- Substitution Patterns ---
subs_brands = random.sample(brands_unique, min(40, len(brands_unique)))
substitution_patterns = []
for i in range(len(subs_brands)//2):
    original = subs_brands[i]
    substitute = subs_brands[-i-1]
    substitution_patterns.append({
        "original": original,
        "substitution": substitute,
        "count": random.randint(10, 300),
        "reason": random.choice(["Out of stock", "Price", "Promo", "Taste", "Availability"])
    })

# --- Brand Trends (for leaderboard, etc.) ---
brand_trends = []
for brand in brands_unique:
    # Get a sample record from original for realistic value/trend
    recs = [r for r in brand_records if r['brand'] == brand]
    if recs:
        rec = random.choice(recs)
        brand_trends.append({
            "brand": brand,
            "category": assign_category(brand),
            "value": rec['value'],
            "pct_change": rec['pct_change']
        })
    else:
        brand_trends.append({
            "brand": brand,
            "category": assign_category(brand),
            "value": round(random.uniform(300000, 3000000), 2),
            "pct_change": round(random.uniform(-0.08, 0.25), 3)
        })

# --- Dashboard Export ---
dashboard_data = {
    "transaction_trends": transaction_trends,
    "consumer_profiling": consumer_profiling,
    "basket_analysis": basket_data,
    "substitution_patterns": substitution_patterns,
    "brand_trends": brand_trends
}

with open("dashboard_data.json", "w") as f:
    json.dump(dashboard_data, f, indent=2)

print("✅ dashboard_data.json generated with all modules aligned!")
print(f"📊 Generated {len(transaction_trends)} transaction trends")
print(f"👥 Generated {len(consumer_profiling)} consumer profiles")
print(f"🛒 Generated {len(basket_data)} basket analyses")
print(f"🔄 Generated {len(substitution_patterns)} substitution patterns")
print(f"📈 Generated {len(brand_trends)} brand trends")
print(f"🏷️  Using {len(brands_unique)} unique brands from your data")