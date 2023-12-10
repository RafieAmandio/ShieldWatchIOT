![ShieldWatch](https://github.com/RafieAmandio/ShieldWatchIOT/assets/88525718/c70b3c1b-4fad-4786-8f7d-a40f3ae0bf2b)
# ShieldWatch : Smart Home Guardian 🏡🔒 

ShieldWatch : Smart Home Guardian is an intelligent home security and automation system that combines cutting-edge technology to provide a comprehensive solution for your home. This project features Intruder Detection with PIR sensors for image capture and notifications, Home Monitoring for environmental data display, and Smart Home Automation for lights control.

**A1 Group**
- 2106637214	Zefanya Christira Deardo
- 2106731232	Rafie Amandio Fauzan
- 2006577441	Rizal Ab'daan
- 2106731623	Muhammad Fathan Muhandis 

## The Problem 🤔
Traditional home security and automation systems are often complex, expensive, and lack the seamless integration required for a truly smart home experience. Users face challenges in setting up, configuring, and maintaining these systems, limiting widespread adoption.

Existing security systems may not provide comprehensive coverage, leaving vulnerabilities that compromise the safety and well-being of homeowners. Additionally, many automation solutions lack the sophistication needed to adapt to the dynamic and diverse needs of modern households.

## The Solution ✨
Smart Home Guardian aims to revolutionize home security and automation by offering a holistic and accessible solution. Our project addresses the shortcomings of existing systems by combining advanced technologies in a user-friendly package.

### Core Features List 

1. **Intruder Detection🚨:**
   - *Description:* Activate the Intruder Detection mode to utilize the PIR sensor for detecting human presence. When triggered, the system captures a photo, sends it to the backend, and notifies the user via email. Additionally, it activates physical indicators like a buzzer and LED.
   - *Components:* PIR Sensor, Camera, Backend, Email Notification, Buzzer, LED.

2. **Home Monitoring 🏡:**
   - *Description:* Monitor essential home parameters, including the status of lights, room temperature, and other relevant sensor data. This feature provides users with a comprehensive view of their home environment.
   - *Components:* Sensor Network, Data Display, Frontend.

3. **Smart Home Automation 🤖:**
   - *Description:* Automate home processes based on specific conditions, such as turning on lights automatically in the evening or at predefined times. Enhance user convenience and energy efficiency through intelligent automation.
   - *Components:* Automation Logic, Time Trigger, Light Control.

These features collectively form the core functionalities of the system, providing a robust smart home security and automation solution. Users can seamlessly manage intruder detection, monitor home parameters, and enjoy the convenience of smart home automation.



## Hardware Design and Implementation Details 🔧

### Camera Module 📷

The Camera Module, a crucial component of the smart home security system, integrates the ESP32 CAM and PIR sensor to enable efficient intruder detection and image capture.

#### Components:
- **ESP32 CAM:** Handles image capture and communication with the backend.
- **PIR Sensor:** Detects human presence to trigger intruder detection.

#### Implementation:
1. **PIR Sensor Activation:** Upon detecting motion, the PIR sensor activates the ESP32 CAM.
2. **Image Capture:** The ESP32 CAM captures images of the detected intrusion.
3. **Communication with Backend:** Captured images are securely transmitted to the backend for further analysis.
4. **Alert Notification:** In parallel, the system notifies the user via email and activates physical indicators like a buzzer and LED.

### Monitoring Module 🏡
The Monitoring Module focuses on providing users with real-time data regarding their home environment. It incorporates an ESP32 microcontroller, DHT11, LDR sensor, buzzer, and lamp for comprehensive monitoring.

#### Components:
- **ESP32 Microcontroller:** Serves as the central control unit for the Monitoring Module.
- **DHT11 Sensor:** Monitors room temperature for environmental data.
- **LDR Sensor:** Measures ambient light conditions.
- **Buzzer:** Provides audible alerts in response to warning events.
- **Lamp:** Offers controllable lighting based on automation or user preferences.

#### Implementation:
1. **Environmental Data Monitoring:** The ESP32 microcontroller reads data from the DHT11 and LDR sensors to monitor room temperature and ambient light conditions.
2. **Light Control:** The system automates lighting based on predefined conditions or user preferences.
3. **Alerts and Notifications:** The buzzer provides audible alerts for specific events, ensuring users are promptly informed about critical situations.

These hardware design and implementation details highlight the functionalities of the Camera Module and Monitoring Module. Together, they form a robust smart home security and automation system, incorporating intruder detection, image capture, environmental monitoring, and intelligent control of home devices.


## Network infrastructure 🌐


In the architecture of our smart home security and automation system, the integration of software and hardware components is seamlessly achieved through the utilization of the HiveMQ MQTT broker and REST API. Acting as a central communication hub, the MQTT broker facilitates real-time data exchange among IoT devices, including the ESP32 CAM and ESP32 microcontroller, ensuring decentralized yet efficient interactions. On the software side, the REST API serves as the bridge between the frontend and backend, enabling user-centric functionalities such as authentication, registration, and device management. This RESTful architecture ensures standardized and stateless communication, fostering interoperability and user-friendly interactions. The synergy between the MQTT broker and REST API forms a cohesive and responsive system, where devices communicate swiftly, and users have seamless control over their smart home environment. This integrated approach not only enhances reliability and responsiveness but also provides a scalable foundation for future feature enhancements and adaptations to evolving smart home requirements.

## Software Implementation Details



## Set-Up Your Own 
## Contributing 🤝

We believe in the power of collaboration. If you have ideas for improvements or new features, we encourage you to contribute by submitting a pull request. 

## License 📜

Smart Home Guardian is open-source software licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it in accordance with the terms of the license.


## Future Works 🔮

Our commitment to innovation doesn't end here. We have exciting plans for the future of Smart Home Guardian:

- **Enhanced Security Features:** Implementing advanced security algorithms and integrating with emerging technologies to provide an even more robust defense against intruders.

- **Expanded Automation Capabilities:** Adding support for a broader range of smart devices, enabling users to automate and control various aspects of their homes seamlessly.

- **Community-Driven Development:** Engaging with our community to gather feedback, suggestions, and contributions to continuously improve and evolve Smart Home Guardian.
