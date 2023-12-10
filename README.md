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
![image](https://github.com/RafieAmandio/ShieldWatchIOT/assets/88525718/dd832a78-a63f-4f83-86e3-e26dfb2719d1)

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
![image](https://github.com/RafieAmandio/ShieldWatchIOT/assets/88525718/bf6fd379-0f44-4dc9-b8d0-02013e0c306c)

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

<img width="1994" alt="Network_Diagram" src="https://github.com/RafieAmandio/ShieldWatchIOT/assets/88525718/c9b84ea3-2396-447d-a7f9-d86fd46fc8e9">

In the architecture of our smart home security and automation system, the integration of software and hardware components is seamlessly achieved through the utilization of the HiveMQ MQTT broker and REST API. Acting as a central communication hub, the MQTT broker facilitates real-time data exchange among IoT devices, including the ESP32 CAM and ESP32 microcontroller, ensuring decentralized yet efficient interactions. On the software side, the REST API serves as the bridge between the frontend and backend, enabling user-centric functionalities such as authentication, registration, and device management. This RESTful architecture ensures standardized and stateless communication, fostering interoperability and user-friendly interactions. The synergy between the MQTT broker and REST API forms a cohesive and responsive system, where devices communicate swiftly, and users have seamless control over their smart home environment. This integrated approach not only enhances reliability and responsiveness but also provides a scalable foundation for future feature enhancements and adaptations to evolving smart home requirements.

## Software Implementation

### Frontend Software 🖥️

The frontend system plays a pivotal role, leveraging the power of React to provide an intuitive and dynamic interface for monitoring all devices connected to a user's account. React, known for its efficiency and flexibility, serves as the backbone for creating a responsive and engaging user experience.

#### Primary Functions
The primary function of the frontend is to serve as a centralized hub for monitoring devices. Through React components, users can seamlessly navigate and visualize real-time data from their connected IoT devices. The system employs REST API calls to establish a secure and efficient connection with the backend, facilitating essential functionalities like user authentication, device registration, and management.

#### Communication Protocols
To establish communication with IoT devices, the frontend utilizes MQTT (Message Queuing Telemetry Transport) protocol. MQTT's lightweight and efficient nature makes it an ideal choice for real-time data exchange with IoT devices. This connection enables the frontend to receive and display crucial information from the devices, ensuring users have immediate access to the latest updates and warnings.

#### Reasoning for Using MQTT and REST API
**MQTT (Message Queuing Telemetry Transport):** We chose MQTT for efficient and real-time communication between the monitoring device and the Frontend. MQTT's lightweight protocol ensures rapid data transfer, making it ideal for monitoring applications where timely updates are crucial. Its publish-subscribe model allows for an organized and responsive data flow.

**REST API (Representational State Transfer Application Programming Interface):** The Frontend interacts with the backend through REST API endpoints for user-related functionalities, such as login, registration, and device management. REST API provides a standardized and stateless communication approach, enhancing interoperability and simplifying integration. This choice ensures a secure and scalable foundation for managing user accounts and devices.

### Backend Software ⚙️

The backend system, powered by Node.js and Express, serves as the brains orchestrating key functionalities.

#### Node.js and Express
The backend leverages the efficiency and scalability of Node.js in tandem with the expressive and minimalist framework Express. This combination facilitates the creation of robust APIs and efficient handling of HTTP requests, ensuring a seamless communication channel with the frontend.

#### TensorFlow.js for Facial Comparison
The integration of TensorFlow.js elevates the security aspect by enabling facial comparison. The backend employs this machine learning library to analyze faces captured by the system and compare them with entries in the database. This enhances the system's ability to detect intruders and provides an added layer of protection.

The TensorFlow.js-powered facial comparison module allows the backend to discern intruders by matching faces captured by the system with those stored in the database. This process ensures the system's ability to accurately identify and respond to potential security threats. The backend seamlessly connects with the database, establishing a secure link for quick retrieval and comparison of facial data.

### Database Design 🗃️

<img width="1152" alt="Database Design" src="https://github.com/RafieAmandio/ShieldWatchIOT/assets/88525718/f1533734-abe5-4474-9a8d-a3e3355f8670">

The project's database relies on MongoDB, a NoSQL solution chosen for its scalability and flexibility. The database comprises two essential collections: User and Device.

#### User Collection
The User collection serves as the repository for user-centric information, encompassing credentials, preferences, and personalized details. MongoDB's flexible schema accommodates evolving user needs, ensuring seamless user authentication, registration, and a personalized experience.

#### Device Collection
The Device collection centralizes information related to connected IoT devices, housing details such as unique identifiers, status, and metadata. MongoDB's document-oriented structure aligns naturally with managing device data, facilitating straightforward queries and updates.


## Test Results and Performance Evaluation 🧪

### Frontend

The frontend interface proves its mettle by displaying real-time data sourced from MQTT topics. Homeowners can conveniently access up-to-date security status information through an intuitive and visually engaging interface. The frontend not only serves as a dashboard for monitoring but also facilitates user-friendly interactions, such as login, registration, and device management, ensuring a seamless user experience.

#### Features Overview

| Feature         | Functionality                                                                                                 | Tested |
| --------------- | ------------------------------------------------------------------------------------------------------------- | ------ |
| Login           | Provides a secure and authenticated entry point for users.                                                     | ✅     |
| Register        | Allows new users to seamlessly create accounts within the system.                                              | ✅     |
| Add New Device   | Enhances the system's scalability by allowing users to effortlessly integrate new IoT devices.                 | ✅     |
| Monitoring      | Stands as the central component, offering users real-time insights into their smart home's security status.    | ✅     |

### Backend

The backend of the smart home security and automation system incorporates critical features to ensure robust functionality and efficient management.

#### Features Overview

| Feature                  | Functionality                                                                                                         | Tested |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------ |
| Connecting to Database   | Establishes a secure and reliable link between the backend and the MongoDB database, supporting data storage and retrieval. | ✅     |
| Face Comparison          | Powered by TensorFlow.js, enables advanced facial recognition for precise intruder detection.                           | ✅     |
| Auto Email Warning       | Automatically generates and sends timely email notifications in response to detected intrusions.                        | ✅     |
| Device and User Management| Empowers homeowners with control over their smart home ecosystem, offering seamless device and user management.           | ✅     |


#### Camera Module

- **Intruder Detection with PIR Sensors:** The ESP32 CAM promptly detects intrusions through its sophisticated Passive Infrared (PIR) sensors, triggering immediate alerts. | ✅

#### Monitoring Module

| Feature                            | Functionality                                                                                                                      | Tested |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Environmental Data Monitoring     | The ESP32 microcontroller connects to DHT11 and LDR sensors, enabling the monitoring of environmental conditions, ensuring accurate temperature readings for comfort and efficient lighting control for energy optimization. | ✅     |
| Communication via MQTT             | Acts as a communication hub, establishing seamless connections with the MQTT broker, facilitating real-time data exchange with the frontend. | ✅     |
| Emergency Warning Feature          | Incorporates an Emergency Warning feature, enabling the device to generate and transmit urgent warning signals in critical situations. | ✅     |

The testing and results showcase the successful implementation of features, ensuring a robust and efficient smart home security and automation system.


## Conclusion 🌟

In conclusion, the Smart Home Security and Automation System represents a comprehensive integration of cutting-edge technologies to provide users with a secure, intelligent, and user-friendly experience. The collaboration of the Frontend, Backend, and robust IoT devices ensures seamless monitoring, automation, and intruder detection, enhancing the overall safety and convenience of the smart home environment.

### Key Achievements 🚀
- **Efficient Frontend Interface:** Leveraging React, the frontend delivers an intuitive and dynamic interface, allowing users to monitor their IoT devices with ease.
- **Real-time Communication:** The use of MQTT and REST API establishes a responsive and organized data flow, ensuring users receive timely updates and alerts.
- **Facial Recognition Security:** TensorFlow.js integration in the backend enhances security through facial comparison, adding an extra layer of protection against potential intruders.
- **Scalable Database Design:** MongoDB's NoSQL solution proves instrumental in managing user and device data, providing flexibility and scalability.

## Future Work 🔮

While the current system achieves significant milestones, there is room for further enhancement and expansion:

### Areas for Improvement 🛠️
- **Facial Recognition Speed:** Invest in faster hardware or optimization techniques to improve the speed of facial recognition processes.
- **Email Notification Service:** Explore options beyond free mailer services to remove limitations on the number of daily emails.
- **MQTT Topic Organization:** Reorganize MQTT topics to a one-topic-per-person structure for improved scalability and efficiency.

### Future Features 🌈
- **Enhanced Automation Logic:** Develop more sophisticated automation logic to cater to diverse user preferences and scenarios.
- **Integration of Additional Sensors:** Expand the system's capabilities by integrating more sensors for comprehensive environmental monitoring.
- **Machine Learning Improvements:** Continuously refine facial recognition algorithms through machine learning updates for improved accuracy.

The Smart Home Security and Automation System lays a solid foundation for a secure and intelligent living environment. Future endeavors aim to further refine existing functionalities, address limitations, and introduce innovative features to elevate the system's overall performance and user experience.


## Contributing 🤝

We believe in the power of collaboration. If you have ideas for improvements or new features, we encourage you to contribute by submitting a pull request. 

## License 📜

Smart Home Guardian is open-source software licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it in accordance with the terms of the license.


## Future Works 🔮

Our commitment to innovation doesn't end here. We have exciting plans for the future of Smart Home Guardian:

- **Enhanced Security Features:** Implementing advanced security algorithms and integrating with emerging technologies to provide an even more robust defense against intruders.

- **Expanded Automation Capabilities:** Adding support for a broader range of smart devices, enabling users to automate and control various aspects of their homes seamlessly.

- **Community-Driven Development:** Engaging with our community to gather feedback, suggestions, and contributions to continuously improve and evolve Smart Home Guardian.
