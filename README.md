# Property Management Application 🏢

A centralized, cross-platform property management dashboard application built with React Native and Expo. This app is fully functional across Android, iOS, and Web browsers from a single codebase.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
Clone the repository and install the dependencies:
```bash
# Navigate into the project folder
cd "Mobile Application"

# Install all dependencies exactly as required by the Expo version
npm install
```

## 💻 How to Run (Web Browser)
To run the application directly in your computer's web browser:

```bash
npx expo start --web
```
- The app will automatically open in a new browser tab at `http://localhost:8081`.

## 📱 How to Run (Android Physical Device)
Since the app is built on Expo, you can preview it instantly on your actual mobile phone without needing Android Studio!

### 1. Requirements
- Download the free **Expo Go** app from the Google Play Store on your Android phone.
- Ensure your Phone and PC are on the **exact same Wi-Fi network**.

### 2. Start the App
Start the local server by running:
```bash
npx expo start --clear
```

### 3. Connect the Phone
- The terminal will display a large QR Code.
- Open the **Expo Go** app on your phone.
- Tap **Scan QR code** and point it at the terminal.
- The app will instantly download and run natively on your phone!

> **Network Issues?** If the app gets stuck or fails to load, it means your Windows Firewall is blocking your phone. Press `Ctrl+C` to stop the server, and run this instead:
> `npx expo start --clear --tunnel`
> This creates a public tunnel bypassing network firewalls. Scan the new QR code it generates.

## 🛠️ Features Included
*   **Dual Platform Structure:** Same React Codebase powers Web Browser interface & Native Mobile App.
*   **Hierarchical Funnel Navigation:** 
    * Home Screen (Property Dashboards) -> Product Type -> BHK Type -> City -> Store Details.
*   **Custom React UI:** Includes Search bars, custom Modal dropdowns, metric cards.
*   **Performance:** Uses native screens optimization mapped for Expo Go testing and Production deployment.
