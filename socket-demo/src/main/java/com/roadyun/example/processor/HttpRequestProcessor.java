package com.roadyun.example.processor;

import com.roadyun.example.common.Constant;
import org.apache.commons.lang3.StringUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * @ClassName: HttpRequestProcessor
 * @Description:  将http请求体封装成map
 * @Author 2181250231@qq.com
 * @Create 2020/6/221:41
 */
public class HttpRequestProcessor {

    private Map<String,String> httpRequest = new HashMap<>(16);

    public Map<String, String> getHttpRequest() {
        return httpRequest;
    }

    public HttpRequestProcessor(InputStream inputStream) throws IOException {
        String httpRequestStr = "";
        byte[] httpRequestBytes = new byte[1024];
        int length = 0;
        if ((length = inputStream.read(httpRequestBytes)) > 0) {
            httpRequestStr = new String(httpRequestBytes, 0, length);
        }
        String[] headArray = httpRequestStr.split(Constant.Line_Separator);
//        Arrays.stream(headArray).forEach();
        System.out.println("headArray:");
        System.out.println(Arrays.toString(headArray));

//        System.out.println(httpRequestStr);
        httpRequest.put("httpRequestStr",httpRequestStr);

        //读取第一行
//        String firstLine = bufferedReader.readLine();
//        if (StringUtils.isNotEmpty(firstLine)){
//            System.out.println("firstLine: " + firstLine);
//            this.parseFirstLine(firstLine);
//            String line = null;
//            //读取请求头字段
//            while (!Constant.SPACE.equals(line = bufferedReader.readLine())){
//                int i = line.indexOf(Constant.COLON);
//                httpRequest.put(line.substring(Constant.ZERO, line.indexOf(Constant.COLON)),
//                        line.substring(line.indexOf(Constant.COLON) + Constant.TWO));
//            }
//            // 解析参数
//            // 1. 解析body参数
//            StringBuilder paramStr = new StringBuilder();
//            while ((line = bufferedReader.readLine()) != null){
//                paramStr.append(line);
//            }
//            if (paramStr.length() > 0){
//                httpRequest.put(Constant.Parameter,paramStr.toString());
//                return;
//            }
//            // 2. 解析url参数
//            if (httpRequest.get(Constant.URL).contains(Constant.Question_Separator)){
//                String[] split = httpRequest.get(Constant.URL).split(Constant.Question_Separator);
//                httpRequest.put(Constant.Parameter,split[1]);
//            }
//            this.parseParameters(bufferedReader);
//        }
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
     * TODO 可按照Content-type 判断解析什么类型的参数
     * @param bufferedReader
     */
    public void parseParameters(BufferedReader bufferedReader) throws IOException {
        // 1. 解析body参数
        StringBuilder paramStr = new StringBuilder();
        String line = null;
        while ((line = bufferedReader.readLine()) != null){
            paramStr.append(line);
        }
        if (paramStr.length() > 0){
            httpRequest.put(Constant.Parameter,paramStr.toString());
            return;
        }
        // 2. 解析url参数
        if (httpRequest.get(Constant.URL).contains(Constant.Question_Separator)){
            String[] split = httpRequest.get(Constant.URL).split(Constant.Question_Separator);
            httpRequest.put(Constant.Parameter,split[1]);
        }
    }
}
