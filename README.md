# Business Manager 🚀
**Manage Orders. Track Payments. Grow Your Business.**

A modern, production-grade business management and khata mobile app built with **React Native (Expo)** and **TypeScript**, specifically designed for local retailers and businesses in Pakistan.

---

## 🎨 Design System & Theme
- **Color Palette:** Premium Emerald Green (`#006A4E`, `#059669`, `#E8F5E9`) + Clean White (`#FFFFFF`)
- **Card Radius:** `16px`
- **Button Height:** `52px`
- **Font Styling:** Clean typography with full bilingual support (**English** & **اردو Urdu**)
- **Local Payment Channels:** Cash, Easypaisa, JazzCash, Bank Transfer

---

## 📱 Complete 15 Screen Implementation

| # | Screen | Description |
|---|---|---|
| 1 | **Splash Screen** | Branded animated intro with app motto |
| 2 | **Onboarding** | Feature showcase with interactive indicators |
| 3 | **Language Select** | Toggle between English & اردو (Urdu) |
| 4 | **Login / OTP** | Pakistani (+92) mobile number login & Google sign-in |
| 5 | **Main Dashboard** | Today's Sales (Rs. 25,500), quick counters, action buttons, recent orders |
| 6 | **Orders** | Search, filter tabs (`All`, `Pending`, `Delivered`, `Cancelled`), order cards |
| 7 | **Add New Order** | Customer dropdown, product selection, subtotal, delivery charges, total |
| 8 | **Order Details** | Full breakdown, status toggle, WhatsApp receipt share |
| 9 | **Customers** | Customer ledger directory, total orders count, outstanding balance |
| 10 | **Customer Profile** | Big outstanding due card, segmented order history & payment log |
| 11 | **Khata / Payments** | Total received vs total due balances, recent payment transactions |
| 12 | **Add Payment** | Payment entry with Cash / JazzCash / Easypaisa / Bank tags |
| 13 | **Inventory** | Stock monitoring, low-stock warnings, add new item modal |
| 14 | **Reports & Analytics**| Daily / Weekly / Monthly performance, bar chart, top-selling items |
| 15 | **Settings & More** | Business profile, Urdu language switch, cloud backup, PDF export |

---

## 📂 Project Architecture

```
business-manager/
├── App.tsx                      # Root component with SafeAreaProvider & Context
├── src/
│   ├── constants/
│   │   ├── theme.ts             # Emerald palette, 16px radius, 52px button height
│   │   └── strings.ts           # Complete English & Urdu localized strings
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces (Order, Customer, Product, etc.)
│   ├── context/
│   │   └── AppContext.tsx       # Global business state & reactive calculations
│   ├── components/
│   │   ├── CustomButton.tsx     # Standard 52px button with variants
│   │   └── StatusBadge.tsx      # Badges for Pending, Delivered, Cancelled
│   ├── screens/
│   │   ├── SplashOnboarding/    # Splash, Onboarding, Language, Login
│   │   ├── Dashboard/           # Dashboard with counters and quick actions
│   │   ├── Orders/              # Order list, Add Order, Order details
│   │   ├── Customers/           # Customer list & profile ledger
│   │   ├── Khata/               # Khata summary & Add payment
│   │   ├── Inventory/           # Stock management
│   │   ├── Reports/             # Sales graphs & top products
│   │   └── Settings/            # Settings & More menu
│   └── navigation/
│       └── AppNavigator.tsx     # Native Stack + Bottom Tabs navigation
```

---

## ⚡ How to Run

1. Open your terminal in the `business-manager` directory:
   ```bash
   cd business-manager
   ```

2. Start the Expo development server:
   ```bash
   npm start
   ```

3. **Run on Mobile:**
   - Install **Expo Go** from Google Play Store (Android) or App Store (iOS).
   - Scan the QR code shown in the terminal.
   - Alternatively press `a` for Android Emulator or `w` for Web preview.
