package com.roadyun.example.common;

import java.io.File;
import java.io.IOException;

/**
 * @ClassName: SystemUtils
 * @Description:
 * @Author 2181250231@qq.com
 * @Create 2020/6/717:44
 */
public class SystemUtils {
    public static String getUserDir(){
        return System.getProperty("user.dir");
    }

    /**
     *
     * @param resourcesPath
     * @return
     */
    public static File getResourcesDir(String resourcesPath){
        File file = new File("socket-demo/src/main/resources/"+resourcesPath);
        if (!file.exists()){
            throw new RuntimeException("\n找不到指定资源: "+ file.getAbsolutePath());
        }
        return file;
    }

    public static void main(String[] args) throws IOException {
//        System.out.println(getUserDir());
//        File file = new File("socket-demo/src/main/resources/index.html");
//        System.out.println(file.getCanonicalPath());
//        System.out.println(file.getAbsolutePath());
//        System.out.println(file.getPath());
        System.out.println(getResourcesDir("/static/index.html"));
    }
}
