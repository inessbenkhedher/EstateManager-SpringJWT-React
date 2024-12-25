package com.example.demo99;

import com.example.demo99.entities.Bien;

public class TestLombok {
    public static void main(String[] args) {
        Bien bien = new Bien();
        bien.setType("message");
        System.out.println(bien.getType());
    }
}
