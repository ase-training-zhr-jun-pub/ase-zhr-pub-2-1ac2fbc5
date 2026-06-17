package io.innoq.calvin

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HelloController {

    @GetMapping("/api/hello")
    fun hello(): String = "Hello World!"
}
