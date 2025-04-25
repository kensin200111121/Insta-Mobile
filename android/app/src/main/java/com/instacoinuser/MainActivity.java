package com.instacoinuser;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Looper;
import android.util.Log;
import android.view.KeyEvent;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;

import com.denovo.app.invokeiposgo.interfaces.GetDeviceListener;
import com.denovo.app.invokeiposgo.interfaces.GetTPNListener;
import com.denovo.app.invokeiposgo.interfaces.TerminalAddListener;
import com.denovo.app.invokeiposgo.interfaces.TransactionListener;
import com.denovo.app.invokeiposgo.launcher.IntentApplication;
import com.denovo.app.invokekozen.printer.interfaces.PrintLauncherInterface;
import com.denovo.app.invokekozen.printer.launcher.IntentPrintApplication;
import com.denovo.app.invokekozen.printer.models.PrintErrorResult;
import com.denovo.app.invokekozen.printer.models.PrintResult;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends ReactActivity {

    ActivityResultLauncher<Intent> activityResultLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            new ActivityResultCallback<ActivityResult>() {
                @Override
                public void onActivityResult(ActivityResult result) {
                    Log.d("Activity Result", "result" + result.toString());
                    intentApplication.handleResultCallBack(result);
                }
            }
    );

    IntentApplication intentApplication;
    IntentPrintApplication intentPrintApplication;

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    public String getMainComponentName() {
        return "instacoinUser";
    }

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    @Override
    public ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(this, getMainComponentName(), DefaultNewArchitectureEntryPoint.getFabricEnabled());
    }

    public void setupIntentApplication() {
        intentApplication = new IntentApplication(getApplicationContext());
        intentPrintApplication = new IntentPrintApplication(getApplicationContext());

        intentPrintApplication.setLaunchInterface(new PrintLauncherInterface() {
            @Override
            public void onPrintSuccess(PrintResult printResult) {
                Log.d("Dejavoo", "onPrintSuccess" + printResult.toString());
                sendEvent("onPrintSuccess", printResult.toString());
            }

            @Override
            public void onPrintFailed(PrintErrorResult errorResult) {
                Log.d("Dejavoo", "onPrintFailed" + errorResult.getErrorMessage());
                sendEvent("onPrintFailed", errorResult.getErrorMessage());
            }
        });

        intentApplication.setTerminalAddListener(new TerminalAddListener() {
            @Override
            public void onApplicationLaunched(JSONObject jsonObject) {
                Log.d("Dejavoo", "onApplicationLaunched" + jsonObject.toString());
                sendEvent("onApplicationLaunched", jsonObject.toString());
            }

            @Override
            public void onApplicationLaunchFailed(JSONObject jsonObject) {
                Log.d("Dejavoo", "onApplicationLaunchFailed" + jsonObject.toString());
                sendEvent("onApplicationLaunchFailed", jsonObject.toString());
            }

            @Override
            public void onTerminalAdded(JSONObject jsonObject) {
                Log.d("Dejavoo", "onTerminalAdded" + jsonObject.toString());
                sendEvent("onTerminalAdded", jsonObject.toString());
            }

            @Override
            public void onTerminalAddFailed(JSONObject jsonObject) {
                Log.d("Dejavoo", "onTerminalAddFailed" + jsonObject.toString());
                sendEvent("onTerminalAddFailed", jsonObject.toString());
            }
        });

        intentApplication.setTransactionListener(new TransactionListener() {
            @Override
            public void onApplicationLaunched(JSONObject jsonObject) {
                sendEvent("onApplicationLaunched", jsonObject.toString());
            }

            @Override
            public void onApplicationLaunchFailed(JSONObject jsonObject) {
                sendEvent("onApplicationLaunchFailed", jsonObject.toString());
            }

            @Override
            public void onTransactionSuccess(JSONObject jsonObject) {
                sendEvent("onTransactionSuccess", jsonObject.toString());
            }

            @Override
            public void onTransactionFailed(JSONObject jsonObject) {
                sendEvent("onTransactionFailed", jsonObject.toString());
            }
        });

        intentApplication.setGetDeviceListener(new GetDeviceListener() {
            @Override
            public void onApplicationLaunched(JSONObject jsonObject) {
                sendEvent("onApplicationLaunched", jsonObject.toString());
            }

            @Override
            public void onApplicationLaunchFailed(JSONObject jsonObject) {
                sendEvent("onApplicationLaunchFailed", jsonObject.toString());
            }

            @Override
            public void onGetDevice(JSONObject jsonObject) {
                sendEvent("onGetDevice", jsonObject.toString());
            }

            @Override
            public void onGetDeviceFailed(JSONObject jsonObject) {
                sendEvent("onGetDeviceFailed", jsonObject.toString());
            }
        });

        intentApplication.setGetTPNListener(new GetTPNListener() {
            @Override
            public void onApplicationLaunched(JSONObject jsonObject) {
                sendEvent("onApplicationLaunched", jsonObject.toString());
            }

            @Override
            public void onApplicationLaunchFailed(JSONObject jsonObject) {
                sendEvent("onApplicationLaunchFailed", jsonObject.toString());
            }

            @Override
            public void onGetTPN(JSONObject jsonObject) {
                sendEvent("onGetTPN", jsonObject.toString());
            }

            @Override
            public void onTPNFailed(JSONObject jsonObject) {
                sendEvent("onTPNFailed", jsonObject.toString());
            }
        });
    }

    public void openTerminal(String data) {
        JSONObject jsonRequest = null;
        try {
            jsonRequest = new JSONObject(data);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        intentApplication.addTerminal(jsonRequest, activityResultLauncher);
    }

    public void getDevice(String data) {
        JSONObject jsonRequest = null;
        try {
            jsonRequest = new JSONObject(data);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        intentApplication.getDevice(jsonRequest, activityResultLauncher);
    }

    public void getTPN(String data) {
        JSONObject jsonRequest = null;
        try {
            jsonRequest = new JSONObject(data);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        intentApplication.getTPN(jsonRequest, activityResultLauncher);
    }

    public void createTransaction(String data) {
        JSONObject jsonRequest = null;
        try {
            jsonRequest = new JSONObject(data);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        intentApplication.performTransaction(jsonRequest, activityResultLauncher);
    }

    public void createTransactionMock(String data) {
        new android.os.Handler(Looper.getMainLooper()).postDelayed(
            new Runnable() {
                public void run() {
                    sendEvent("onTransactionSuccess", data);
                }
            }, 
        3000);
    }

    public void printReceipt(String data) {
        intentPrintApplication.launchPrinter(data);
    }

    public void sendEvent(String type, String data) {
        WritableMap payload = Arguments.createMap();
        payload.putString("data", data);
        payload.putString("type", type);

        DejavooPaymentModule.sendEvent("onDejavooEvent", payload);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            //preventing default implementation previous to android.os.Build.VERSION_CODES.ECLAIR
            return true;
        }
        if (keyCode == KeyEvent.KEYCODE_HOME || keyCode == KeyEvent.KEYCODE_MENU) {
            //preventing default implementation previous to android.os.Build.VERSION_CODES.ECLAIR
            return true;
        }
        if (keyCode == KeyEvent.KEYCODE_APP_SWITCH || keyCode == KeyEvent.KEYCODE_RECENT_APPS) {
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
