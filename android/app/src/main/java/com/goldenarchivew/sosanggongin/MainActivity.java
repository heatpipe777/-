package com.goldenarchivew.sosanggongin;

import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView webView = getBridge().getWebView();
        // 화면 끝에서 더 당길 때 화면 전체가 늘어났다 돌아오는(울렁거리는) 안드로이드 기본 효과를 꺼요
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        // 오른쪽에 잠깐씩 보이는 회색 스크롤 막대도 숨겨요
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
    }
}
