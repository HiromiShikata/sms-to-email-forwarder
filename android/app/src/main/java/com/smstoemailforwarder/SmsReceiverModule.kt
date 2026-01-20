package com.smstoemailforwarder

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.provider.Telephony
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class SmsReceiverModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var smsReceiver: BroadcastReceiver? = null

    override fun getName(): String = "SmsReceiverModule"

    @ReactMethod
    fun startListening(promise: Promise) {
        try {
            if (smsReceiver != null) {
                promise.resolve(true)
                return
            }

            smsReceiver = object : BroadcastReceiver() {
                override fun onReceive(context: Context?, intent: Intent?) {
                    if (intent?.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
                        val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
                        messages.forEach { smsMessage ->
                            val params = Arguments.createMap().apply {
                                putString("originatingAddress", smsMessage.originatingAddress ?: "Unknown")
                                putString("messageBody", smsMessage.messageBody ?: "")
                                putString("receivedAt", SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).format(Date()))
                            }
                            sendEvent("onSmsReceived", params)
                        }
                    }
                }
            }

            val filter = IntentFilter(Telephony.Sms.Intents.SMS_RECEIVED_ACTION)
            filter.priority = IntentFilter.SYSTEM_HIGH_PRIORITY
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                reactApplicationContext.registerReceiver(smsReceiver, filter, Context.RECEIVER_EXPORTED)
            } else {
                reactApplicationContext.registerReceiver(smsReceiver, filter)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SMS_LISTENER_ERROR", e.message)
        }
    }

    @ReactMethod
    fun stopListening(promise: Promise) {
        try {
            smsReceiver?.let {
                reactApplicationContext.unregisterReceiver(it)
                smsReceiver = null
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SMS_LISTENER_ERROR", e.message)
        }
    }

    private fun sendEvent(eventName: String, params: com.facebook.react.bridge.WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}
}
