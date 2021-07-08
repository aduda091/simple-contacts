package com.simplecontacts.customModules;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.os.Build;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class UnMuteModule extends ReactContextBaseJavaModule {

    private Context appContext;

    UnMuteModule(ReactApplicationContext context) {
        super(context);
        appContext = context;
    }

    @Override
    public String getName() {
        return "UnMuteModule";
    }

    public Context getAppContext() {
        return appContext;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void tryGettingAccess() {
        NotificationManager notificationManager =
                (NotificationManager) appContext.getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                && !notificationManager.isNotificationPolicyAccessGranted()) {

            Intent intent = new Intent(
                    android.provider.Settings
                            .ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS ).setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            appContext.startActivity(intent);
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isMuted() {
        AudioManager audio = (AudioManager) appContext.getSystemService(Context.AUDIO_SERVICE);
        int ringerMode = audio.getRingerMode();
        return ringerMode == AudioManager.RINGER_MODE_SILENT || ringerMode == AudioManager.RINGER_MODE_VIBRATE;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int getAudioMode() {
        AudioManager audio = (AudioManager) appContext.getSystemService(Context.AUDIO_SERVICE);
        return audio.getRingerMode();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void unMute() {
        AudioManager audio = (AudioManager) appContext.getSystemService(Context.AUDIO_SERVICE);
        audio.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
    }
}
