 UH Sugar Land Student Center Web Application

A front-end web application developed for CIS 2336: Web Application Development at the University of Houston.

---------------------------------------------------------------------------------------------------------------------------------------------------------

 Project Information
Lead Student Developer: Ethan Patterson
UH Email: epatterson@uh.edu
Course: CIS 2336 - Web Application Development
Semester: Fall 2026

---------------------------------------------------------------------------------------------------------------------------------------------------------

 Project Architecture & Structure


uhsl-student-center/
├── index.html               Homepage with hero, video tour embed, amenities, and developer contact
├── booking.html             Facility reservation form and real-time active bookings table
├── faq.html                 5-item accessible accordion FAQ component
├── README.md                Project documentation and user guide
├── css/
│   └── style.css            Responsive layout, animations, table styles, and UH color hierarchy
└── js/
    ├── nav.js               Dynamic navigation system with active page detection
    ├── booking.js           Client-side form validation, conflict detection & localStorage persistence
    └── faq.js               Accessible accordion collapse/expand state handler


---------------------------------------------------------------------------------------------------------------------------------------------------------

 Features & Implementation Details

 1. Dynamic Client-Side Navigation (js/nav.js)
 Dynamically constructs the navigation bar across all pages.
 Analyzes window.location.pathname to highlight the active menu link and apply accessibility attributes (aria-current="page").
 Works seamlessly both when served locally over HTTP and when opened directly via file:///.

 2. Room Booking System with Conflict Detection (js/booking.js & booking.html)
 5 Supported Student Center Facilities:
  1. Cougar Quiet Study Room A (Capacity: 4)
  2. Collaborative Tech Lab B (Capacity: 8)
  3. Executive Conference Room (Capacity: 12)
  4. Multipurpose Student Org Hall (Capacity: 30)
  5. Esports & Digital Media Lounge (Capacity: 10)
 Client-Side Form Validation:
   Requires student's full name.
   Regex validation for CougarNet / UH email (@uh.edu or @cougarnet.uh.edu).
   Regex validation for 7-digit numeric PeopleSoft student ID (^\d{7}$).
   Date picker with minimum date constrained to today (disallowing past dates).
   Time slot selection from 6 standardized two-hour blocks.
 Double-Booking Conflict Detection:
   Checks scheduled dates and time slots against existing reservations to prevent double-booking.
   Displays an error alert if the requested room and time slot are already occupied.
 Client-Side Data Persistence & DOM Updates:
   Saves confirmed reservations in localStorage with a fallback to in-memory state.
   Dynamically populates and updates the "Active Facility Reservations" table upon confirmation.
   Generates an individual confirmation code (CONF-XXXX) for each booking.
   Includes a "Reset Schedule" control to easily restore sample reservations for evaluation.

 3. Accessible Accordion FAQ (js/faq.js & faq.html)
 5 accordion items covering center hours, study room guidelines, tech checkout, refreshments, and lost & found.
 Manages aria-expanded attributes for accessibility.
 Auto-collapses neighboring accordion items to keep the page tidy.

 4. Responsive UH Branding (css/style.css)
 Compliant with University of Houston visual standards:
   UH Scarlet
   UH Slate
   Dark Charcoal
   Neutral Light Gray
 Responsive layout utilizing CSS Grid and Flexbox for mobile, tablet, and desktop viewing.
