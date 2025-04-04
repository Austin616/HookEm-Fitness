
# Welcome to HookEm Fitness 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get Started

### 1. Install dependencies

Run the following command to install the project dependencies:

```bash
npm install
```

### 2. Set up Firebase

Create a Firebase account and set up a Firebase project. Afterward, create a Firebase config file and ensure you include the following services:

- **Authentication**: For user authentication.
- **Firestore (DB)**: To store user data in a typical JSON format.
- **Storage**: To store media files that users upload (e.g., profile pictures).

### 3. Start the app

Once everything is set up, you can start the app with one of the following commands:

```bash
npx expo start
```

or

```bash
npm start
```

In the output, you'll find options to open the app in:

- A [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- An [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- An [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can begin development by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Overview

### Tech Stack

- **JavaScript/React Native**: Used for building the mobile app.
- **Expo**: Cross-platform mobile development for iOS and Android.
- **Firebase**: Utilized for backend services.
  - **Authentication**: Handles user authentication.
  - **Firestore (DB)**: Stores user data in a JSON format.
  - **Storage**: Stores media, such as profile pictures.

You can find the exercise JSON data on the [GitHub repo](https://github.com/Austin616/free-exercise-db).
