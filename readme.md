# Simple contacts app

A simple contacts list/detail app with very large font sizes, designed to be used by people with vision problems.

## For Android development

After `npm install`, run `npm run android`.

Note: any packages linked via `react-native link` (or `npm run link`) won't show in Git changelog, no need to embarrass yourself like me and add them to MainApplication.java

## To install on real Android device

In order to avoid messing with certificates, go to android/app/build/outputs/apk/release and copy the app-release.apk file to your device. Make sure you have the required third-party app installation permissions inside settings on the phone.
