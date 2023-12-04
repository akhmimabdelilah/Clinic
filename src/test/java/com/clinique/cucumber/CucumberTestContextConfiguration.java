package com.clinique.cucumber;

import com.clinique.CliniqueApp;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = CliniqueApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
