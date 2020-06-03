package com.roadyun.example.processor;

import com.roadyun.example.common.Constant;
import org.apache.commons.lang3.StringUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * @ClassName: HttpRequestProcessor
 * @Description:  将http请求体封装成map
 * @Author 2181250231@qq.com
 * @Create 2020/6/221:41
 */
public class HttpRequestProcessor {

    private static Map<String,String> httpRequest = new HashMap<>(16);

    public HttpRequestProcessor(BufferedReader bufferedReader) throws IOException {
        //读取第一行
        String firstLine = bufferedReader.readLine();
        this.parseFirstLine(firstLine);

    }

    /**
     * 解析第一行
     * @param firstLine
     */
    private void parseFirstLine(String firstLine) {
        if (StringUtils.isNotEmpty(firstLine)){
            String[] firstLineArray = firstLine.split(Constant.Blank_Separator);
            httpRequest.put(Constant.Method,firstLineArray[0]);
            String url = firstLineArray[1];
            httpRequest.put(Constant.URL,url);
        }
    }

    /**
     * 解析参数
     */
    public void parseParameters(){

        //get 请求只考虑 ?拼接参数的情况
        if (StringUtils.equalsIgnoreCase(httpRequest.get(Constant.Method),Constant.GET)){
            if (httpRequest.get(Constant.URL).contains(Constant.Question_Separator)){
                String[] split = httpRequest.get(Constant.URL).split(Constant.Question_Separator);
                httpRequest.put(Constant.Parameter,split[1]);
            }
            // post 参数
        }else if (StringUtils.equalsIgnoreCase(httpRequest.get(Constant.Method),Constant.POST)){

        }
    }
}
