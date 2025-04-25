package com.instacoinuser;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Map;
import java.util.HashMap;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Looper;
import android.util.Log;

public class DejavooPaymentModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    DejavooPaymentModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "DejavooPaymentModule";
    }

    @ReactMethod
    public void setupDejavoo() {
        Log.d("Dejavoo", "Setting up");

        final Activity activity = getCurrentActivity();
        if (activity instanceof MainActivity) {
            ((MainActivity) activity).setupIntentApplication();
        }
    }

    @ReactMethod
    public void getTPN(String data) {
        Log.d("Dejavoo", "Get TPN");

        final Activity activity = getCurrentActivity();
        if (activity instanceof MainActivity) {
            ((MainActivity) activity).getTPN(data);
        }
    }

    @ReactMethod
    public void openTerminal(String data) {
        Log.d("Dejavoo", "Open Termianl");

        final Activity activity = getCurrentActivity();
        if (activity instanceof MainActivity) {
            ((MainActivity) activity).openTerminal(data);
        }
    }

    @ReactMethod
    public void getDevice(String data) {
        Log.d("Dejavoo", "Get Device");
        final Activity activity = getCurrentActivity();
        if (activity instanceof MainActivity) {
            ((MainActivity) activity).getDevice(data);
        }
    }

    @ReactMethod
    public void createTransaction(String data) {
        Log.d("Dejavoo", "Create Transaction");
        final Activity activity = getCurrentActivity();
        if (activity instanceof MainActivity) {
            ((MainActivity) activity).createTransaction(data);
        }
    }

    @ReactMethod
    public void createTransactionMock(String data) {
        Log.d("Dejavoo", "Create Transaction Mock");
        final Activity activity = getCurrentActivity();
        if (activity instanceof MainActivity) {
            ((MainActivity) activity).createTransactionMock(data);
        }
    }

    @ReactMethod
    public void printReceipt(String data) {
        Log.d("Dejavoo", "Print the receipt data");
        final Activity activity = getCurrentActivity();
        if (activity instanceof MainActivity) {
            ((MainActivity) activity).printReceipt(data);
        }
    }

    public static void sendEvent(String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}

