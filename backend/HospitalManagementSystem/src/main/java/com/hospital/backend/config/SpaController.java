package com.hospital.backend.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {
            "/",
            "/patient/**",
            "/doctor/**",
            "/admin/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
