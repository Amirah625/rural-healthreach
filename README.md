# RuralReach Connect

Build Version 1 of a mobile-first healthcare web application called:



RURALREACH HEALTH



Tagline:

"Healthcare that reaches you, wherever you are."



IMPORTANT:

I have attached two reference images:

1. The official RuralReach Health logo.

2. A UI/UX reference showing the intended visual style and screen structure.



Use these images as the primary visual references for this application.



DO NOT copy another existing application's branding or assets. Recreate the design language, layout principles, component patterns, and overall feeling specifically for RuralReach Health.



==================================================

1. PRODUCT PURPOSE

==================================================



RuralReach Health is a healthcare-access platform designed to help people in underserved and rural communities find available healthcare services and facilities near them.



The core idea is simple:



A user needs healthcare → tells RuralReach what they need → finds nearby healthcare facilities → understands what services are available → can eventually contact or navigate to the facility.



This is a HACKATHON MVP.



Do not over-engineer the application.

Do not add unnecessary enterprise features.

Do not create a complicated healthcare management system.



Version 1 should focus primarily on establishing the visual identity, responsive application shell, navigation, and the first functional user experience.



==================================================

2. TECHNOLOGY

==================================================



Use:



- React

- TypeScript

- Tailwind CSS

- Modern component-based architecture

- Lucide icons or another consistent open-source icon library

- Responsive design



The application should be optimized primarily for MOBILE users, while also working properly on tablet and desktop screens.



Keep the code clean, modular, and easy to extend in future versions.



Do not introduce a backend or authentication system yet unless absolutely necessary.



Use local/mock data for this version.



==================================================

3. BRAND IDENTITY

==================================================



Application name:



RuralReach Health



Use the ATTACHED LOGO as the application's official logo.



Do not redesign or replace the logo.



The visual identity should feel:



- Warm

- Welcoming

- Trustworthy

- Human

- Community-oriented

- Healthcare-focused

- Modern

- Accessible

- Calm

- Suitable for rural communities



Avoid making the application feel like a cold hospital management system.



Avoid an overly corporate SaaS appearance.



Avoid excessive gradients, glassmorphism, neon colors, or overly futuristic UI.



The visual language should feel warm and trustworthy.



==================================================

4. COLOR DIRECTION

==================================================



Use the logo as the primary source of inspiration for the color palette.



Primary colors should revolve around:



- Deep healthcare green

- Natural/leaf green

- Soft warm off-white

- Very light cream backgrounds

- Dark charcoal/green text

- Small amounts of warm yellow/orange for highlights

- Red ONLY for emergency states



The interface should NOT be dominated by pure white.



Use warm off-white/cream surfaces where appropriate.



Green should communicate:



- Healthcare

- Trust

- Positive states

- Availability

- Primary actions



Red should ONLY be used for:



- Emergency

- Critical alerts

- Dangerous/unavailable states



Keep the color system consistent throughout the entire application.



==================================================

5. TYPOGRAPHY

==================================================



Use a highly readable modern font.



Headings should feel friendly and confident.



Body text should prioritize readability and accessibility.



Use clear hierarchy:



- Large page headings

- Medium section headings

- Comfortable body text

- Small supporting text



Do not use extremely thin typography.



Do not make important healthcare information too small.



==================================================

6. GENERAL UI STYLE

==================================================



Follow the visual principles shown in the attached UI reference:



- Rounded cards

- Soft shadows

- Spacious layouts

- Clean sections

- Rounded buttons

- Clear icons

- Friendly illustrations

- Large touch targets

- Clear visual hierarchy

- Mobile-first layouts



Cards should have a subtle, premium but approachable appearance.



Buttons should be easy to identify and tap.



Do not overcrowd screens.



Use consistent border radius, spacing, shadows, and icon sizing.



==================================================

7. ANIMATION & MICRO-INTERACTIONS

==================================================



The application should feel alive, but animations must remain subtle and professional.



Use smooth animations for:



- Page transitions

- Button hover/tap states

- Card appearance

- Navigation changes

- Modal/bottom-sheet appearance

- Filter selection

- Loading states



Use gentle fade/slide animations.



For important cards, use a subtle entrance animation when they appear.



Buttons should have a small scale or visual feedback on interaction.



Do NOT use excessive bouncing, spinning, or distracting animations.



Animations should support the user's experience rather than distract from healthcare information.



Respect reduced-motion preferences where possible.



==================================================

8. APPLICATION STRUCTURE

==================================================



Create the following primary navigation:



BOTTOM NAVIGATION:



Home

Map

Resources

Messages



Include a profile/avatar or profile access point in the appropriate location.



The bottom navigation should remain simple and mobile-friendly.



Use icons with labels.



The active navigation item should use the primary green brand color.



==================================================

9. VERSION 1 SCREENS

==================================================



Build the following screens for Version 1:



A. HOME

B. FIND HEALTHCARE FACILITY

C. MAP

D. RESOURCES

E. MESSAGES

F. BASIC PROFILE

G. EMERGENCY/HELP SECTION



However, do not build complicated backend functionality yet.



These screens should establish the complete application shell and allow basic navigation between them.



==================================================

10. HOME SCREEN

==================================================



The Home screen is the most important screen in Version 1.



Follow the attached UI reference closely in terms of hierarchy, but make the implementation original for RuralReach Health.



Top area:



- Hamburger/menu icon

- RuralReach Health logo

- Notification icon



Hero area:



Show a warm rural healthcare illustration or visual similar in feeling to the attached reference.



The illustration should communicate:



- Rural community

- Healthcare

- Accessibility

- Human connection



Do not use random generic corporate stock imagery.



Below the illustration, include a prominent green rounded card containing:



"Quality healthcare information and services in your hands."



Primary CTA:



"Get Started"



The CTA should navigate to the Find Healthcare Facility screen.



Below this, include:



"What do you need today?"



Create six accessible action cards:



1. Find Healthcare Facility

2. Health Assistant

3. Health Information

4. USSD / SMS Access

5. My Profile

6. Emergency / Help



For Version 1:



- Find Healthcare Facility should work.

- Health Information should navigate to Resources.

- My Profile should navigate to Profile.

- Emergency / Help should navigate to the emergency screen.

- USSD / SMS Access should navigate to a DEMO screen or placeholder explaining that the USSD experience will be implemented in a future version.

- Health Assistant can be a clearly labeled coming-soon/demo interaction.



Do not pretend that actual USSD telecom integration exists.



==================================================

11. FIND HEALTHCARE FACILITY SCREEN

==================================================



Create a screen titled:



"Find Healthcare Facility"



Top:



- Back button

- Page title

- Filter button



Include a search bar:



"Search for clinics, hospitals..."



Include location:



"Near you — Oye Ekiti"



with a "Change" action.



For Version 1, location can be mock/demo data.



Create realistic DEMO healthcare facilities.



Example:



Oye General Hospital

1.2 km away

24/7 Service



Ireopudun Health Center

2.7 km away

Mon - Sat: 8am - 6pm



Oye Primary Healthcare

4.3 km away

Mon - Fri: 8am - 4pm



Each facility should be presented as a clean card.



Each card should contain:



- Facility name

- Distance

- Opening/availability information

- Healthcare facility icon/image

- Contact/call action

- View/details interaction



Use mock data only.



Clearly structure the data so it can easily be replaced by a real database later.



Include filters such as:



- Open now

- Nearest

- Facility type

- Services



The filters can work locally using mock data.



==================================================

12. FACILITY DATA

==================================================



Create a small local mock dataset of approximately 6-10 healthcare facilities.



Each facility should have:



- id

- name

- type

- distance

- openingHours

- services

- phone

- latitude

- longitude

- availability

- costLevel



Example services:



- General consultation

- Maternal care

- Child healthcare

- Pharmacy

- Laboratory

- Emergency care



Use fictional/demo information.



DO NOT present fictional information as verified real-world healthcare data.



Add a small interface note where appropriate:



"Demo facility data — availability should be verified before visiting."



==================================================

13. MAP SCREEN

==================================================



Create a Map screen inspired by the attached reference.



For Version 1, use a visual map placeholder or mock map component if a real map API has not been connected.



Show several healthcare facility markers.



Include:



- Search location

- Filter button

- Facility markers

- Selected facility card

- Directions CTA



The selected facility card should show:



Oye General Hospital

1.2 km away

24/7 Service



Button:



"Directions"



If a real map integration is not configured, do NOT fake real-time navigation.



The interface can clearly indicate that map/navigation integration will be connected in a later version.



==================================================

14. RESOURCES SCREEN

==================================================



Create:



"Health Information"



Include categories:



- Maternal Health

- Child Health

- Common Illnesses

- Nutrition



Display educational article cards.



Example articles:



"Understanding Malaria Prevention"



"Healthy Eating for a Strong Body"



"Understanding High Blood Pressure"



"Maternal Health Basics"



Use demo content.



This is informational content only.



Do not present the application as a diagnostic tool.



==================================================

15. MESSAGES SCREEN

==================================================



Create a clean Messages screen.



For Version 1, this can be a simple empty/demo state.



Example:



"Your conversations will appear here."



Add a friendly illustration/icon.



Do not build a complex messaging backend yet.



==================================================

16. PROFILE SCREEN

==================================================



Create a simple profile screen.



Use DEMO information only.



Do not use the personal information shown in the reference image.



Include:



- Profile photo/avatar

- Name placeholder

- Location

- Basic preferences

- Notification settings

- Accessibility settings



Example:



"Demo User"



"Oye Ekiti"



Do not collect medical history or sensitive health information in Version 1.



==================================================

17. EMERGENCY / HELP SCREEN

==================================================



Create a dedicated emergency/help screen.



This screen should be visually distinct from the normal application.



Use red only where necessary.



Heading:



"Emergency / Help"



Include a prominent emergency section:



"In an emergency, seek immediate help from the appropriate local emergency service."



Include a clear emergency call action using demo/local configuration.



Do not create fake emergency service integrations.



Do not make claims that the application itself provides emergency medical care.



Include:



- Find nearest emergency facility

- Emergency information

- General help resources



This is a prototype.



==================================================

18. USSD / SMS DEMO

==================================================



Create a USSD/SMS demonstration entry point.



This is NOT a real telecom integration.



The purpose is to demonstrate our future vision for people who may have limited internet access.



Create a visual mockup similar to a basic phone/USSD interface.



Example:



"RuralReach Health"



1. Find Healthcare

2. Emergency Help

3. Health Information

4. About RuralReach



Include a clear label:



"Prototype demonstration — actual USSD/SMS integration is planned for a future version."



Do NOT claim that dialing a number will actually connect to the application.



==================================================

19. ACCESSIBILITY

==================================================



Accessibility is a core part of RuralReach Health.



Ensure:



- High readable contrast

- Large enough touch targets

- Clear labels

- Simple language

- No important information conveyed by color alone

- Keyboard accessibility on desktop

- Screen-reader-friendly buttons and labels

- Responsive mobile layout

- Reduced-motion support



The interface should be understandable to someone who is not highly experienced with technology.



==================================================

20. RESPONSIVENESS

==================================================



The primary target is mobile.



Design for:



- Small smartphones

- Large smartphones

- Tablets

- Desktop



On mobile:



- Use bottom navigation.

- Cards should fit comfortably within the viewport.

- Avoid horizontal scrolling.

- Buttons should be easy to tap.

- Important information should appear above the fold when possible.



On desktop, expand the layout gracefully without simply stretching mobile elements.



==================================================

21. IMPORTANT MVP RULES

==================================================



This is Version 1.



DO NOT build:



- Real patient medical records

- Real diagnosis

- Real prescription management

- Real payment processing

- Real government integration

- Real NGO integration

- Real telecom/USSD integration

- Real hospital databases

- Complex authentication

- Complex analytics

- Telemedicine infrastructure



Use mock/demo data where necessary.



Keep architecture ready for these capabilities to be added in future versions.



==================================================

22. UX PRINCIPLE

==================================================



The most important user journey is:



HOME

↓

Find Healthcare Facility

↓

Choose/search healthcare need

↓

See nearby facilities

↓

View facility

↓

Contact / Directions



This journey should feel extremely simple.



A user should not need to understand technology to use RuralReach Health.



==================================================

23. QUALITY BAR

==================================================



The final result should look like a polished modern healthcare product suitable for a hackathon demo.



It should NOT look like:



- A generic AI-generated dashboard

- A template

- A developer prototype

- A desktop website squeezed onto mobile

- A hospital administration system



It should feel like a real product designed specifically for underserved communities.



Use the attached RuralReach Health logo consistently.



Maintain consistent:



- Colors

- Typography

- Icons

- Border radius

- Spacing

- Shadows

- Button styles

- Animation behavior



Do not randomly introduce new colors or visual styles on different screens.



==================================================

24. IMPORTANT DEVELOPMENT INSTRUCTION

==================================================



Build this in a clean, modular way so that future versions can extend the application without rewriting the entire frontend.



Start with the application shell, design system, routing/navigation, Home screen, and core mock data.



Then implement the other Version 1 screens.



Do not add features outside this specification.



After implementation, ensure every navigation button works and there are no dead links.



The application should run successfully without errors.



Before considering Version 1 complete, test:



1. Home → Find Healthcare

2. Home → Resources

3. Home → Profile

4. Home → Emergency

5. Home → USSD Demo

6. Find Healthcare → facility interaction

7. Map → selected facility

8. Bottom navigation between all main sections

9. Responsive behavior on mobile

10. Animation and interaction states



IMPORTANT:

Prioritize correctness, consistency, simplicity, and visual quality over adding more features.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://rural-healthreach.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ceb970f6-76bc-44d8-a5de-c3ac046c63f8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
