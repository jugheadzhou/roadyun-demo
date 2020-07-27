package com.roadyun.example.test;

import java.util.Optional;

/**
 * @ClassName: Test
 * @Description:
 * @Author 2181250231@qq.com
 * @Create 2020/7/2721:43
 */
public class Test {
    public static void main(String[] args) {
        String url = "222";
        System.out.println(Optional.ofNullable(url).isPresent());
        String s = Optional.ofNullable(url).orElse("null");
        System.out.println(s);
        System.out.println(Optional.ofNullable(s).isPresent());
//        System.out.println(Optional.ofNullable(url).flatMap(s -> s.substring()));

    }
}
