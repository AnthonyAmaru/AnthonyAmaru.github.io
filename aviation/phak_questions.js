var PHAK_QUESTIONS = {
  phak_ch1: {
    title: "PHAK Ch1: Introduction to Flying",
    sections: [
      {
        title: "Chapter 1 Key Concepts",
        sectionRef: "PHAK Ch1",
        questions: [
            {
              id: "phak_ch1_q1",
              q: "The first scheduled airline flight in the United States operated between which two cities?",
              opts: [
                "New York and Washington, DC",
                          "St. Petersburg and Tampa",
                          "San Francisco and New York",
                          "Dayton and Kitty Hawk"
              ],
              ans: 1,
              exp: "The first scheduled airline flight was conducted on January 1, 1914, between St. Petersburg and Tampa, Florida, using a Benoist airboat. The flight lasted 23 minutes due to a headwind.",
              ref: { pdf: 20, page: 2, bookPage: "Ch1" }
            },
            {
              id: "phak_ch1_q2",
              q: "What legislation served as the cornerstone for aviation within the United States?",
              opts: [
                "Civil Aeronautics Act of 1938",
                          "Air Commerce Act of 1926",
                          "Federal Aviation Act of 1958",
                          "Airline Deregulation Act of 1978"
              ],
              ans: 1,
              exp: "The Air Commerce Act of 1926, passed on May 20, 1926, served as the cornerstone for aviation. It charged the Secretary of Commerce with fostering air commerce, issuing air traffic rules, licensing pilots, and certificating aircraft.",
              ref: { pdf: 21, page: 3, bookPage: "Ch1" }
            },
            {
              id: "phak_ch1_q3",
              q: "Who received the first pilot license issued by a civilian agency of the Federal Government?",
              opts: [
                "Orville Wright",
                          "Elwood Richard 'Pete' Quesada",
                          "William P. MacCracken, Jr.",
                          "Charles Lindbergh"
              ],
              ans: 2,
              exp: "William P. MacCracken, Jr., the Chief of the Aeronautics Branch, received the first pilot license on April 6, 1927. Orville Wright, who was no longer an active flier, had declined the honor.",
              ref: { pdf: 21, page: 3, bookPage: "Ch1" }
            },
            {
              id: "phak_ch1_q4",
              q: "FDC NOTAMs are issued by the National Flight Data Center and contain information that is primarily what?",
              opts: [
                "Regulatory in nature pertaining to flight",
                          "About temporary runway and taxiway closures",
                          "Related to bird activity and wildlife hazards",
                          "Concerning airport fuel and customs service availability"
              ],
              ans: 0,
              exp: "FDC NOTAMs contain information that is regulatory in nature, including changes to charts, procedures, and airspace usage. They deal with items such as interim IFR procedures, TFRs, and airspace changes.",
              ref: { pdf: 30, page: 12, bookPage: "Ch1" }
            },
            {
              id: "phak_ch1_q5",
              q: "Which of the following is a required keyword used as the first part of a NOTAM (D) text?",
              opts: [
                "WX",
                          "FUEL",
                          "OBST",
                          "TFR"
              ],
              ans: 2,
              exp: "All NOTAM (D) entries must include one of the following keywords: RWY, TWY, RAMP, APRON, AD, OBST, NAV, COM, SVC, AIRSPACE, (U), or (O). OBST indicates an obstruction-related NOTAM.",
              ref: { pdf: 29, page: 12, bookPage: "Ch1" }
            },
            {
              id: "phak_ch1_q6",
              q: "According to 14 CFR 1.1, an airplane is defined as what?",
              opts: [
                "A rotorcraft that depends on engine-driven rotors for lift",
                          "An engine-driven fixed-wing aircraft heavier than air supported by the dynamic reaction of air against its wings",
                          "A lighter-than-air aircraft that can be steered",
                          "A powered aircraft with a flexible or semi-rigid wing"
              ],
              ans: 1,
              exp: "14 CFR 1.1 defines an airplane as an engine-driven fixed-wing aircraft heavier than air that is supported in flight by the dynamic reaction of the air against its wings. This distinguishes it from rotorcraft, balloons, and weight-shift control aircraft.",
              ref: { pdf: 32, page: 14, bookPage: "Ch1" }
            },
            {
              id: "phak_ch1_q7",
              q: "The Aeronautical Information Manual (AIM) is the official guide to what?",
              opts: [
                "Aircraft maintenance and inspection procedures",
                          "Pilot certification and testing requirements",
                          "Basic flight information and ATC procedures for the NAS",
                          "Airport design and construction standards"
              ],
              ans: 2,
              exp: "The AIM is the official guide to basic flight information and ATC procedures for the NAS. It also contains information on health and medical facts, flight safety, and a pilot/controller glossary.",
              ref: { pdf: 26, page: 9, bookPage: "Ch1" }
            },
            {
              id: "phak_ch1_q8",
              q: "14 CFR Part 91 provides guidance in which areas?",
              opts: [
                "Certification of pilots and flight instructors",
                          "General flight rules, VFR, and IFR",
                          "Aircraft maintenance and alterations",
                          "Airworthiness standards for normal category airplanes"
              ],
              ans: 1,
              exp: "14 CFR Part 91 provides guidance in general flight rules, visual flight rules (VFR), and instrument flight rules (IFR). Part 61 covers pilot certification, Part 43 covers maintenance, and Part 23 covers airworthiness standards.",
              ref: { pdf: 25, page: 7, bookPage: "Ch1" }
            },
            {
              id: "phak_ch1_q9",
              q: "The FAA's premier aviation research, development, test, and evaluation facility is located where?",
              opts: [
                "Oklahoma City, Oklahoma",
                          "Atlantic City, New Jersey",
                          "Washington, DC",
                          "Dayton, Ohio"
              ],
              ans: 1,
              exp: "The William J. Hughes Technical Center (WJHTC) in Atlantic City, New Jersey, is the premier aviation research and development and test and evaluation facility. The Mike Monroney Aeronautical Center in Oklahoma City is home to FAA training and logistics.",
              ref: { pdf: 25, page: 8, bookPage: "Ch1" }
            },
            {
              id: "phak_ch1_q10",
              q: "Under 14 CFR 103, what is the maximum empty weight for a powered ultralight vehicle?",
              opts: [
                "155 pounds",
                          "254 pounds",
                          "103 pounds",
                          "200 pounds"
              ],
              ans: 1,
              exp: "Powered ultralight vehicles must weigh less than 254 pounds empty weight, while unpowered ultralight vehicles must weigh less than 155 pounds. Rules for ultralight vehicles are contained in 14 CFR Part 103.",
              ref: { pdf: 31, page: 14, bookPage: "Ch1" }
            }
        ]
      }
    ]
  },
  phak_ch2: {
    title: "PHAK Ch2: Aeronautical Decision-Making",
    sections: [
      {
        title: "Chapter 2 Key Concepts",
        sectionRef: "PHAK Ch2",
        questions: [
            {
              id: "phak_ch2_q1",
              q: "According to the text, approximately what percentage of all aviation accidents are related to human factors?",
              opts: [
                "50 percent",
                          "80 percent",
                          "90 percent",
                          "65 percent"
              ],
              ans: 1,
              exp: "It is estimated that approximately 80 percent of all aviation accidents are related to human factors, with the vast majority occurring during landing (24.1 percent) and takeoff (23.4 percent).",
              ref: { pdf: 43, page: 1, bookPage: "Ch2" }
            },
            {
              id: "phak_ch2_q2",
              q: "Which of the following is NOT one of the five hazardous attitudes identified in ADM?",
              opts: [
                "Complacency",
                          "Anti-authority",
                          "Invulnerability",
                          "Resignation"
              ],
              ans: 0,
              exp: "The five hazardous attitudes are anti-authority, impulsivity, invulnerability, macho, and resignation. Complacency is not listed as one of the five hazardous attitudes identified through past and contemporary study.",
              ref: { pdf: 46, page: 5, bookPage: "Ch2" }
            },
            {
              id: "phak_ch2_q3",
              q: "What is the correct antidote for the 'Macho' hazardous attitude?",
              opts: [
                "Follow the rules. They are usually right.",
                          "Not so fast. Think first.",
                          "Taking chances is foolish.",
                          "I'm not helpless. I can make a difference."
              ],
              ans: 2,
              exp: "The antidote for the Macho attitude ('I can do it') is 'Taking chances is foolish.' The antidote for anti-authority is 'Follow the rules,' for impulsivity is 'Not so fast. Think first,' and for resignation is 'I'm not helpless.'",
              ref: { pdf: 46, page: 5, bookPage: "Ch2" }
            },
            {
              id: "phak_ch2_q4",
              q: "The IMSAFE checklist is used to determine what before flight?",
              opts: [
                "Aircraft airworthiness and equipment status",
                          "Physical and mental readiness for flying",
                          "Weather minimums and environmental conditions",
                          "Navigational equipment and communication serviceability"
              ],
              ans: 1,
              exp: "The IMSAFE checklist (Illness, Medication, Stress, Alcohol, Fatigue, Emotion) is used to determine a pilot's physical and mental readiness for flying. It is one of the best ways single pilots can mitigate risk.",
              ref: { pdf: 49, page: 8, bookPage: "Ch2" }
            },
            {
              id: "phak_ch2_q5",
              q: "In the PAVE risk mitigation checklist, what does the 'V' stand for?",
              opts: [
                "Velocity",
                          "enVironment",
                          "Visibility",
                          "Verification"
              ],
              ans: 1,
              exp: "PAVE stands for Pilot-in-command, Aircraft, enVironment, and External pressures. The environment category includes weather, terrain, airport conditions, airspace, and nighttime considerations.",
              ref: { pdf: 49, page: 8, bookPage: "Ch2" }
            },
            {
              id: "phak_ch2_q6",
              q: "The 5 Ps of Single-Pilot Resource Management consist of the Plan, the Plane, the Pilot, the Passengers, and what?",
              opts: [
                "The Procedures",
                          "The Programming",
                          "The Purpose",
                          "The Performance"
              ],
              ans: 1,
              exp: "The 5 Ps are the Plan, the Plane, the Pilot, the Passengers, and the Programming. The 5 P check should be conducted at preflight, pretakeoff, midpoint or hourly, pre-descent, and just prior to the final approach fix.",
              ref: { pdf: 54, page: 13, bookPage: "Ch2" }
            },
            {
              id: "phak_ch2_q7",
              q: "How does the text define the difference between a hazard and a risk?",
              opts: [
                "A hazard is always physical; risk is always psychological",
                          "Hazard and risk are essentially the same thing",
                          "A hazard is a real or perceived condition; risk is the assessment of the potential impact of that hazard",
                          "Risk is the condition encountered; hazard is the pilot's response"
              ],
              ans: 2,
              exp: "A hazard is a real or perceived condition, event, or circumstance that a pilot encounters. Risk is the assessment of the single or cumulative hazard facing a pilot — the value assigned to the potential impact of the hazard.",
              ref: { pdf: 45, page: 4, bookPage: "Ch2" }
            },
            {
              id: "phak_ch2_q8",
              q: "Which of the following is one of the four fundamental principles of risk management?",
              opts: [
                "Always delegate risk decisions to ATC",
                          "Accept no unnecessary risk",
                          "Avoid all risks in any flying activity",
                          "Make risk decisions only after takeoff"
              ],
              ans: 1,
              exp: "The four principles are: accept no unnecessary risk, make risk decisions at the appropriate level, accept risk when benefits outweigh dangers, and integrate risk management into planning at all levels. Flying inherently involves some risk.",
              ref: { pdf: 45, page: 3, bookPage: "Ch2" }
            },
            {
              id: "phak_ch2_q9",
              q: "Single-Pilot Resource Management (SRM) includes all of the following EXCEPT?",
              opts: [
                "Risk management (RM)",
                          "Task management (TM)",
                          "Controlled flight into terrain (CFIT) awareness",
                          "Crew resource management (CRM)"
              ],
              ans: 3,
              exp: "SRM includes ADM, risk management, task management, automation management, CFIT awareness, and situational awareness. CRM focuses on pilots operating in crew environments, while SRM is designed for single-pilot operations.",
              ref: { pdf: 45, page: 4, bookPage: "Ch2" }
            },
            {
              id: "phak_ch2_q10",
              q: "According to studies cited in the text, which trait was discovered in pilots prone to having accidents?",
              opts: [
                "They are methodical and disciplined in information gathering",
                          "They have disdain toward rules",
                          "They consistently underutilize available resources",
                          "They have superior multitasking abilities"
              ],
              ans: 1,
              exp: "Five traits were discovered in accident-prone pilots including disdain toward rules, high correlation between flying accidents and driving violations, thrill-seeking personality, impulsivity, and disregard for outside information sources.",
              ref: { pdf: 53, page: 12, bookPage: "Ch2" }
            }
        ]
      }
    ]
  },
  phak_ch3: {
    title: "PHAK Ch3: Aircraft Construction",
    sections: [
      {
        title: "Chapter 3 Key Concepts",
        sectionRef: "PHAK Ch3",
        questions: [
            {
              id: "phak_ch3_q1",
              q: "The FAA certifies which three types of aviation products?",
              opts: [
                "Airframes, avionics, and landing gear",
                          "Aircraft, aircraft engines, and propellers",
                          "Wings, fuselages, and tail assemblies",
                          "Normal, utility, and acrobatic aircraft"
              ],
              ans: 1,
              exp: "The FAA certifies three types of aviation products: aircraft, aircraft engines, and propellers. Each product must be designed to a set of airworthiness standards contained in 14 CFR.",
              ref: { pdf: 75, page: 1, bookPage: "Ch3" }
            },
            {
              id: "phak_ch3_q2",
              q: "Normal, Utility, Acrobatic, and Commuter category airplanes must meet airworthiness standards in which 14 CFR part?",
              opts: [
                "14 CFR Part 25",
                          "14 CFR Part 23",
                          "14 CFR Part 27",
                          "14 CFR Part 33"
              ],
              ans: 1,
              exp: "Normal, Utility, Acrobatic, and Commuter category airplanes are covered under 14 CFR Part 23. Transport category airplanes fall under Part 25, normal category rotorcraft under Part 27, and aircraft engines under Part 33.",
              ref: { pdf: 75, page: 1, bookPage: "Ch3" }
            },
            {
              id: "phak_ch3_q3",
              q: "Monocoque construction supports almost all loads through which component?",
              opts: [
                "An internal truss framework",
                          "The stressed skin",
                          "Composite sandwich panels",
                          "Welded steel tubing"
              ],
              ans: 1,
              exp: "Monocoque construction uses stressed skin to support almost all loads, much like an aluminum beverage can. While very strong, it is not highly tolerant to deformation of the surface, as a deformed area can collapse easily.",
              ref: { pdf: 81, page: 8, bookPage: "Ch3" }
            },
            {
              id: "phak_ch3_q4",
              q: "Which type of aircraft construction uses a substructure of bulkheads and stringers with the skin attached to carry flight loads?",
              opts: [
                "Monocoque",
                          "Truss structure",
                          "Semimonocoque",
                          "Composite"
              ],
              ans: 2,
              exp: "Semimonocoque construction uses a substructure of bulkheads, formers, and stringers to reinforce the stressed skin by taking some of the bending stress. Most modern aircraft use semimonocoque construction.",
              ref: { pdf: 82, page: 9, bookPage: "Ch3" }
            },
            {
              id: "phak_ch3_q5",
              q: "What is a primary disadvantage of composite materials in aircraft construction?",
              opts: [
                "They are heavier than aluminum in all applications",
                          "They cannot be formed into complex curved shapes",
                          "Low energy impacts may cause hidden damage with no visible surface sign",
                          "They are highly susceptible to corrosion from moisture"
              ],
              ans: 2,
              exp: "A key disadvantage of composites is the lack of visual proof of damage from low energy impacts. A bump or tool drop may not leave any visible sign, but underneath there can be extensive delaminations spreading in a cone-shaped area.",
              ref: { pdf: 83, page: 10, bookPage: "Ch3" }
            },
            {
              id: "phak_ch3_q6",
              q: "Which type of empennage design incorporates a one-piece horizontal stabilizer that pivots from a central hinge point?",
              opts: [
                "Conventional tail",
                          "Stabilator",
                          "V-tail",
                          "T-tail"
              ],
              ans: 1,
              exp: "A stabilator is a one-piece horizontal stabilizer that pivots from a central hinge point. It does not require a separate elevator and typically includes an antiservo tab to reduce sensitivity and provide trim capability.",
              ref: { pdf: 79, page: 6, bookPage: "Ch3" }
            },
            {
              id: "phak_ch3_q7",
              q: "Standard airworthiness certificates are what color, and special airworthiness certificates are what color?",
              opts: [
                "White and pink",
                          "White and yellow",
                          "Green and red",
                          "Blue and white"
              ],
              ans: 0,
              exp: "Standard airworthiness certificates are white and issued for normal, utility, acrobatic, commuter, or transport category aircraft. Special airworthiness certificates are pink and issued for primary, restricted, limited, and light sport aircraft.",
              ref: { pdf: 75, page: 1, bookPage: "Ch3" }
            },
            {
              id: "phak_ch3_q8",
              q: "The position of the center of gravity (CG) of an aircraft primarily determines what?",
              opts: [
                "The maximum airspeed of the aircraft",
                          "The stability of the aircraft in flight",
                          "The engine power output",
                          "The fuel efficiency during cruise"
              ],
              ans: 1,
              exp: "The position of the CG determines the stability of the aircraft in flight. As the CG moves rearward, the aircraft becomes more dynamically unstable. The CG is computed during design and affected by loading and equipment installation.",
              ref: { pdf: 76, page: 3, bookPage: "Ch3" }
            },
            {
              id: "phak_ch3_q9",
              q: "Which composite reinforcing fiber has high tensile and compressive strength, good impact resistance, but is somewhat heavy?",
              opts: [
                "Carbon fiber",
                          "Fiberglass",
                          "Kevlar",
                          "Epoxy resin"
              ],
              ans: 1,
              exp: "Fiberglass has good tensile and compressive strength, good impact resistance, is easy to work with, and relatively inexpensive. Its main disadvantage is that it is somewhat heavy compared to carbon fiber.",
              ref: { pdf: 83, page: 10, bookPage: "Ch3" }
            },
            {
              id: "phak_ch3_q10",
              q: "The four forces acting on an aircraft in straight-and-level, unaccelerated flight are:",
              opts: [
                "Thrust, drag, lift, and gravity",
                          "Thrust, friction, lift, and weight",
                          "Thrust, drag, lift, and weight",
                          "Power, drag, lift, and mass"
              ],
              ans: 2,
              exp: "The four forces are thrust (forward force produced by the powerplant), drag (rearward retarding force), lift (upward force produced by the wing), and weight (downward force of gravity). Thrust opposes drag; lift opposes weight.",
              ref: { pdf: 75, page: 2, bookPage: "Ch3" }
            }
        ]
      }
    ]
  },
  phak_ch4: {
    title: "PHAK Ch4: Aerodynamics of Flight",
    sections: [
      {
        title: "Chapter 4 Key Concepts",
        sectionRef: "PHAK Ch4",
        questions: [
            {
              id: "phak_ch4_q1",
              q: "Viscosity is best defined as:",
              opts: [
                "The weight of a fluid per unit volume",
                          "The property of a fluid that causes it to resist flowing",
                          "The force applied perpendicular to a surface",
                          "The resistance between two solid surfaces in contact"
              ],
              ans: 1,
              exp: "Viscosity is the property of a fluid that causes it to resist flowing. High-viscosity fluids are 'thick' and resist flow, while low-viscosity fluids are 'thin' and flow easily. Air has low viscosity and flows easily.",
              ref: { pdf: 91, page: 1, bookPage: "Ch4" }
            },
            {
              id: "phak_ch4_q2",
              q: "Under standard conditions at sea level, atmospheric pressure is approximately:",
              opts: [
                "14.70 psi or 29.92 inches of mercury",
                          "14.70 psi or 29.92 millibars",
                          "29.92 psi or 1013.2 inches of mercury",
                          "14.70 inches of mercury or 1013.2 psi"
              ],
              ans: 0,
              exp: "Under standard conditions at sea level, atmospheric pressure is approximately 14.70 psi or 29.92 inches of mercury (1013.2 mb). The standard atmosphere also specifies a surface temperature of 59 °F or 15 °C.",
              ref: { pdf: 92, page: 2, bookPage: "Ch4" }
            },
            {
              id: "phak_ch4_q3",
              q: "Density altitude is defined as:",
              opts: [
                "The altitude indicated on the altimeter when set to 29.92",
                          "Pressure altitude corrected for nonstandard temperature",
                          "The actual height above mean sea level",
                          "The altitude at which the aircraft is flying in the standard atmosphere"
              ],
              ans: 1,
              exp: "Density altitude is pressure altitude corrected for nonstandard temperature. High density altitude (thin air) reduces engine power, thrust, and lift, decreasing aircraft performance. Low density altitude (dense air) improves performance.",
              ref: { pdf: 93, page: 3, bookPage: "Ch4" }
            },
            {
              id: "phak_ch4_q4",
              q: "Bernoulli's Principle states that as the velocity of a moving fluid increases:",
              opts: [
                "The pressure within the fluid increases",
                          "The pressure within the fluid decreases",
                          "The temperature of the fluid increases proportionally",
                          "The density of the fluid remains constant"
              ],
              ans: 1,
              exp: "Bernoulli's Principle states that as the velocity of a moving fluid increases, the pressure within the fluid decreases. This principle is demonstrated by a venturi tube and explains lift generation over the curved top of a wing.",
              ref: { pdf: 95, page: 5, bookPage: "Ch4" }
            },
            {
              id: "phak_ch4_q5",
              q: "Newton's Third Law of Motion states that:",
              opts: [
                "Force equals mass times acceleration",
                          "For every action, there is an equal and opposite reaction",
                          "Every object persists in its state of rest unless compelled to change",
                          "Energy cannot be created or destroyed"
              ],
              ans: 1,
              exp: "Newton's Third Law states that for every action there is an equal and opposite reaction. In an airplane, the propeller pushes air backward and the air pushes the propeller (and airplane) forward, producing thrust.",
              ref: { pdf: 95, page: 5, bookPage: "Ch4" }
            },
            {
              id: "phak_ch4_q6",
              q: "The chord line of an airfoil is defined as:",
              opts: [
                "The curved upper surface of the wing from leading to trailing edge",
                          "A straight line drawn through the profile connecting the leading and trailing edges",
                          "The distance from the leading edge to the point of maximum thickness",
                          "A line equidistant from the upper and lower surfaces at all points"
              ],
              ans: 1,
              exp: "The chord line is a straight line drawn through the profile connecting the extremities of the leading and trailing edges. The mean camber line is equidistant at all points from the upper and lower surfaces.",
              ref: { pdf: 96, page: 6, bookPage: "Ch4" }
            },
            {
              id: "phak_ch4_q7",
              q: "What causes a wingtip vortex to form?",
              opts: [
                "Engine exhaust creating turbulence at the wingtips",
                          "The boundary layer separating at the wingtip",
                          "High-pressure air below the wing spilling around the tip to the low-pressure area above",
                          "The ailerons creating a pressure differential at the wingtips"
              ],
              ans: 2,
              exp: "The high-pressure area on the bottom of an airfoil pushes around the tip to the low-pressure area on the top, creating a rotating flow called a tip vortex. Winglets are used to reduce this flow.",
              ref: { pdf: 98, page: 8, bookPage: "Ch4" }
            },
            {
              id: "phak_ch4_q8",
              q: "What is the standard temperature lapse rate up to 36,000 feet?",
              opts: [
                "5.0 °F or 3.0 °C per thousand feet",
                          "3.5 °F or 2.0 °C per thousand feet",
                          "1.0 °F per thousand feet",
                          "1.0 °C per thousand feet"
              ],
              ans: 1,
              exp: "The standard temperature lapse rate is a decrease of approximately 3.5 °F or 2 °C per thousand feet up to 36,000 feet, where it reaches approximately -65 °F or -55 °C. Above this point, temperature is considered constant up to 80,000 feet.",
              ref: { pdf: 92, page: 2, bookPage: "Ch4" }
            },
            {
              id: "phak_ch4_q9",
              q: "As the angle of attack of an airfoil increases, the center of pressure (CP) moves in which direction?",
              opts: [
                "Aft toward the trailing edge",
                          "Forward toward the leading edge",
                          "It remains stationary at the midpoint of the chord",
                          "It moves to the wingtip"
              ],
              ans: 1,
              exp: "At high angles of attack, the CP moves forward, while at low angles of attack the CP moves aft. This CP travel is very important in wing structure design as it affects the position of air loads on the wing.",
              ref: { pdf: 97, page: 8, bookPage: "Ch4" }
            },
            {
              id: "phak_ch4_q10",
              q: "What effect does humidity (water vapor) have on air density?",
              opts: [
                "Moist air is heavier and denser than dry air",
                          "Moist air is lighter and less dense than dry air",
                          "Humidity has no measurable effect on air density",
                          "Humidity increases density only at temperatures above 80 °F"
              ],
              ans: 1,
              exp: "Water vapor is lighter than air. As the water content of air increases, the air becomes less dense, increasing density altitude and decreasing aircraft performance. Warm air holds more water vapor than cold air.",
              ref: { pdf: 94, page: 4, bookPage: "Ch4" }
            }
        ]
      }
    ]
  },
  phak_ch5: {
    title: "PHAK Ch5: Flight Controls",
    sections: [
      {
        title: "Chapter 5 Key Concepts",
        sectionRef: "PHAK Ch5",
        questions: [
            {
              id: "phak_ch5_q1",
              q: "In steady, straight-and-level, unaccelerated flight, which statement correctly describes the forces?",
              opts: [
                "The four forces are always equal to each other",
                          "The sum of all upward components of forces equals the sum of all downward components",
                          "Thrust must always exceed drag to maintain altitude",
                          "Lift and weight are always the only vertical forces"
              ],
              ans: 1,
              exp: "The sum of all upward components of forces (not just lift) equals the sum of all downward components (not just weight). Similarly, forward components equal backward components. This refines the simple 'thrust equals drag; lift equals weight' formula.",
              ref: { pdf: 101, page: 1, bookPage: "Ch5" }
            },
            {
              id: "phak_ch5_q2",
              q: "Angle of attack (AOA) is defined as the acute angle between:",
              opts: [
                "The longitudinal axis of the aircraft and the horizon",
                          "The chord line of the airfoil and the direction of the relative wind",
                          "The wing chord and the horizontal reference plane",
                          "The flight path and the horizon"
              ],
              ans: 1,
              exp: "AOA is defined as the acute angle between the chord line of the airfoil and the direction of the relative wind. It is fundamental to understanding airplane performance, stability, and control.",
              ref: { pdf: 101, page: 1, bookPage: "Ch5" }
            },
            {
              id: "phak_ch5_q3",
              q: "The lift-to-drag ratio (L/D) is a measure of:",
              opts: [
                "The aircraft's maximum speed capability",
                          "Airfoil efficiency — the amount of lift generated compared to drag",
                          "The ratio of parasitic drag to induced drag",
                          "The structural strength of the wing"
              ],
              ans: 1,
              exp: "The L/D ratio is the amount of lift generated by a wing compared to its drag. Aircraft with higher L/D ratios are more efficient. L/DMAX occurs at a specific CL and AOA, where total drag is at a minimum.",
              ref: { pdf: 104, page: 4, bookPage: "Ch5" }
            },
            {
              id: "phak_ch5_q4",
              q: "The three types of parasite drag are:",
              opts: [
                "Form drag, induced drag, and skin friction",
                          "Form drag, interference drag, and skin friction",
                          "Induced drag, interference drag, and wave drag",
                          "Form drag, profile drag, and induced drag"
              ],
              ans: 1,
              exp: "The three types of parasite drag are form drag (due to aircraft shape), interference drag (from intersecting airstreams), and skin friction (from air moving over the aircraft surface). Induced drag is a separate category associated with lift production.",
              ref: { pdf: 105, page: 5, bookPage: "Ch5" }
            },
            {
              id: "phak_ch5_q5",
              q: "Induced drag is caused by:",
              opts: [
                "The shape of the aircraft and its components",
                          "The production of lift by the airfoil",
                          "The friction of air moving over the wing surface",
                          "The intersection of airstreams at wing roots and joints"
              ],
              ans: 1,
              exp: "Induced drag is inherent whenever an airfoil is producing lift — it is inseparable from lift production. It results from the pressure differential causing spanwise flow and tip vortices. As AOA increases, induced drag increases proportionally.",
              ref: { pdf: 106, page: 6, bookPage: "Ch5" }
            },
            {
              id: "phak_ch5_q6",
              q: "Positive static stability is defined as the initial tendency of an aircraft to:",
              opts: [
                "Continue away from the original state of equilibrium when disturbed",
                          "Return to the original state of equilibrium after being disturbed",
                          "Remain in a new condition after its equilibrium has been disturbed",
                          "Oscillate with increasing amplitude over time"
              ],
              ans: 1,
              exp: "Positive static stability is the initial tendency to return to the original state of equilibrium after being disturbed. Neutral static stability keeps the new condition, while negative static stability continues away from equilibrium.",
              ref: { pdf: 113, page: 14, bookPage: "Ch5" }
            },
            {
              id: "phak_ch5_q7",
              q: "Ground effect occurs when an aircraft is within approximately what distance from the surface?",
              opts: [
                "Within 100 feet of the surface",
                          "Within several feet of the surface, altering the three-dimensional flow pattern",
                          "Within one wingspan of the surface",
                          "When the wheels touch the runway"
              ],
              ans: 1,
              exp: "Ground effect occurs when an aircraft in flight comes within several feet of the surface, changing the three-dimensional flow pattern as the surface restricts the vertical airflow component. This alters upwash, downwash, and wingtip vortices.",
              ref: { pdf: 110, page: 11, bookPage: "Ch5" }
            },
            {
              id: "phak_ch5_q8",
              q: "When a wing encounters ground effect at a constant angle of attack, what happens to induced drag?",
              opts: [
                "It increases due to ground proximity",
                          "It remains unchanged",
                          "It decreases due to the reduction of wingtip vortices",
                          "It fluctuates with airspeed changes"
              ],
              ans: 2,
              exp: "Ground effect reduces wingtip vortices, which alters the spanwise lift distribution and reduces induced drag. At a height equal to one-fourth the wing span, induced drag reduction is 23.5 percent; at one-tenth span, reduction is 47.6 percent.",
              ref: { pdf: 110, page: 11, bookPage: "Ch5" }
            },
            {
              id: "phak_ch5_q9",
              q: "Wingtip vortices are at maximum strength when the generating aircraft is:",
              opts: [
                "Light, clean, and fast",
                          "Heavy, clean, and slow",
                          "Heavy, dirty, and fast",
                          "Light, dirty, and slow"
              ],
              ans: 1,
              exp: "Wingtip vortices are greatest when the generating aircraft is 'heavy, clean, and slow.' This condition is most common during approaches and departures when the AOA is highest. The heavier and slower the aircraft, the stronger the vortices.",
              ref: { pdf: 108, page: 8, bookPage: "Ch5" }
            },
            {
              id: "phak_ch5_q10",
              q: "According to the lift equation, an airplane traveling at 200 knots produces how much lift compared to the same airplane at 100 knots (with AOA and other factors constant)?",
              opts: [
                "Two times the lift",
                          "Four times the lift",
                          "Eight times the lift",
                          "The same lift"
              ],
              ans: 1,
              exp: "Lift is proportional to the square of velocity. Since 200 knots is double 100 knots, the lift increases by a factor of four (2² = 4). This is why pilots must reduce AOA when increasing speed to maintain level flight.",
              ref: { pdf: 103, page: 3, bookPage: "Ch5" }
            }
        ]
      }
    ]
  },
  phak_ch6: {
    title: "PHAK Ch6: Aircraft Systems",
    sections: [
      {
        title: "Chapter 6 Key Concepts",
        sectionRef: "PHAK Ch6",
        questions: [
            {
              id: "phak_ch6_q1",
              q: "Which surfaces constitute the primary flight control system of an aircraft?",
              opts: [
                "Ailerons, elevator, and rudder",
                          "Flaps, spoilers, and trim tabs",
                          "Ailerons, flaps, and trim",
                          "Elevator, rudder, and throttle"
              ],
              ans: 0,
              exp: "The ailerons, elevator (or stabilator), and rudder constitute the primary control system required to control an aircraft safely during flight. Wing flaps, leading edge devices, spoilers, and trim systems are secondary controls.",
              ref: { pdf: 152, page: 1, bookPage: "Ch6" }
            },
            {
              id: "phak_ch6_q2",
              q: "Adverse yaw is caused by which aerodynamic effect during a turn?",
              opts: [
                "The rudder being deflected opposite to the direction of bank",
                          "Higher drag on the downward deflected aileron, which produces more lift",
                          "Uneven fuel distribution between the left and right wings",
                          "Propeller torque effect causing the nose to yaw left"
              ],
              ans: 1,
              exp: "The downward deflected aileron produces more lift but also more drag. This added drag causes that wing to slow down, resulting in the aircraft yawing toward the wing with increased lift. Adverse yaw is more pronounced at low airspeeds.",
              ref: { pdf: 153, page: 3, bookPage: "Ch6" }
            },
            {
              id: "phak_ch6_q3",
              q: "At low airspeeds, the primary flight controls typically feel:",
              opts: [
                "Firm and highly responsive",
                          "Soft and sluggish with slow response",
                          "Heavy and stiff requiring significant force",
                          "Identical to their feel at high airspeeds"
              ],
              ans: 1,
              exp: "At low airspeeds, the controls usually feel soft and sluggish, and the aircraft responds slowly to control applications. At higher airspeeds, the controls become increasingly firm and aircraft response is more rapid.",
              ref: { pdf: 152, page: 1, bookPage: "Ch6" }
            },
            {
              id: "phak_ch6_q4",
              q: "How does a stabilator differ from a conventional elevator and horizontal stabilizer arrangement?",
              opts: [
                "It is located on the vertical stabilizer instead of the empennage",
                          "It is a one-piece horizontal stabilizer that pivots from a central hinge point",
                          "It does not use any trim tabs or control surfaces",
                          "It only moves in one direction to provide pitch control"
              ],
              ans: 1,
              exp: "A stabilator is a one-piece horizontal stabilizer that pivots from a central hinge point, eliminating the need for a separate elevator. It uses an antiservo tab extending across its trailing edge to reduce sensitivity.",
              ref: { pdf: 157, page: 7, bookPage: "Ch6" }
            },
            {
              id: "phak_ch6_q5",
              q: "In a T-tail configuration, where is the elevator located in relation to the rest of the aircraft?",
              opts: [
                "At the bottom of the vertical stabilizer near the fuselage",
                          "At the top of the vertical stabilizer, above most downwash effects",
                          "On the fuselage below the tail section",
                          "On the leading edge of the wing as a canard"
              ],
              ans: 1,
              exp: "In a T-tail, the elevator is at the top of the vertical stabilizer, above most effects of downwash from the propeller and airflow around the fuselage and wings. T-tails are popular on aircraft with aft fuselage-mounted engines and seaplanes.",
              ref: { pdf: 156, page: 6, bookPage: "Ch6" }
            },
            {
              id: "phak_ch6_q6",
              q: "Which type of flap not only changes the camber of the wing but also increases the wing area?",
              opts: [
                "Plain flap",
                          "Split flap",
                          "Slotted flap",
                          "Fowler flap"
              ],
              ans: 3,
              exp: "Fowler flaps slide backwards on tracks, increasing both the wing area and camber. In the first portion of extension, they increase lift significantly with little drag increase. As extension continues, the flap deflects downward and increases drag.",
              ref: { pdf: 159, page: 9, bookPage: "Ch6" }
            },
            {
              id: "phak_ch6_q7",
              q: "What is the purpose of spoilers on an aircraft?",
              opts: [
                "To increase lift during takeoff and climb",
                          "To spoil smooth airflow, reducing lift and increasing drag",
                          "To improve engine cooling during ground operations",
                          "To reduce drag and increase cruise airspeed"
              ],
              ans: 1,
              exp: "Spoilers are high-drag devices deployed from the wings to spoil smooth airflow, reducing lift and increasing drag. On gliders they control descent rate; on other aircraft they are used for roll control and to reduce ground roll after landing.",
              ref: { pdf: 160, page: 10, bookPage: "Ch6" }
            },
            {
              id: "phak_ch6_q8",
              q: "Trim systems are primarily designed to:",
              opts: [
                "Increase the aircraft's maximum speed",
                          "Relieve the pilot of the need to maintain constant pressure on the flight controls",
                          "Reduce the aircraft's stall speed",
                          "Improve the aircraft's turning radius"
              ],
              ans: 1,
              exp: "Trim systems relieve the pilot of maintaining constant pressure on the flight controls. They consist of flight deck controls and small hinged devices on the trailing edge of primary flight controls, helping minimize pilot workload.",
              ref: { pdf: 160, page: 10, bookPage: "Ch6" }
            },
            {
              id: "phak_ch6_q9",
              q: "Antiservo tabs on a stabilator move in which direction relative to the stabilator's trailing edge?",
              opts: [
                "The opposite direction",
                          "The same direction",
                          "They do not move; they are fixed devices",
                          "Perpendicular to the stabilator surface"
              ],
              ans: 1,
              exp: "Antiservo tabs move in the same direction as the trailing edge of the stabilator. This decreases the sensitivity of the stabilator and functions as a trim device. In contrast, trim tabs on conventional elevators move opposite the control surface.",
              ref: { pdf: 161, page: 11, bookPage: "Ch6" }
            },
            {
              id: "phak_ch6_q10",
              q: "The frise-type aileron helps reduce adverse yaw by what mechanism?",
              opts: [
                "Automatically applying rudder through interconnected springs",
                          "Projecting the leading edge of the raised aileron into the airflow to create drag",
                          "Decreasing the camber of both ailerons simultaneously",
                          "Increasing the lift on both wings to maintain level flight"
              ],
              ans: 1,
              exp: "When pressure is applied, the raised aileron pivots on an offset hinge, projecting its leading edge into the airflow to create drag. This helps equalize drag with the lowered aileron on the opposite wing, reducing adverse yaw.",
              ref: { pdf: 154, page: 4, bookPage: "Ch6" }
            }
        ]
      }
    ]
  },
  phak_ch7: {
    title: "PHAK Ch7: Flight Instruments",
    sections: [
      {
        title: "Chapter 7 Key Concepts",
        sectionRef: "PHAK Ch7",
        questions: [
            {
              id: "phak_ch7_q1",
              q: "What is the main difference between spark ignition and compression ignition reciprocating engines?",
              opts: [
                "The number of cylinders",
                          "The process of igniting the fuel",
                          "The type of propeller used",
                          "The cooling method"
              ],
              ans: 1,
              exp: "The main difference between spark ignition and compression ignition is the process of igniting the fuel. Spark ignition uses a spark plug; compression ignition compresses air to ignite fuel.",
              ref: { pdf: 2, page: 164, bookPage: "Ch7" }
            },
            {
              id: "phak_ch7_q2",
              q: "Which type of reciprocating engine remains the most popular on smaller aircraft today?",
              opts: [
                "Radial engine",
                          "In-line engine",
                          "Horizontally-opposed engine",
                          "V-type engine"
              ],
              ans: 2,
              exp: "The horizontally-opposed engine remains the most popular reciprocating engine used on smaller aircraft.",
              ref: { pdf: 2, page: 164, bookPage: "Ch7" }
            },
            {
              id: "phak_ch7_q3",
              q: "What is the 'weeping wing' anti-ice system?",
              opts: [
                "Heated boots on the leading edge that shed ice",
                          "Small holes in the leading edge that weep antifreeze solution to prevent ice buildup",
                          "An electric heating element embedded in the wing surface",
                          "A pneumatic system that expands rubber boots to crack ice"
              ],
              ans: 1,
              exp: "The weeping-wing design uses small holes in the leading edge to weep antifreeze solution, preventing formation and buildup of ice.",
              ref: { pdf: 2, page: 203, bookPage: "Ch7" }
            },
            {
              id: "phak_ch7_q4",
              q: "What can happen if a propeller anti-ice boot fails to heat properly on one blade?",
              opts: [
                "The propeller may overspeed",
                          "Unequal ice loading can cause severe propeller vibration",
                          "The engine oil temperature will increase rapidly",
                          "The ammeter will show a continuous zero reading"
              ],
              ans: 1,
              exp: "If a boot fails to heat one blade, unequal blade loading can result and may cause severe propeller vibration.",
              ref: { pdf: 2, page: 203, bookPage: "Ch7" }
            },
            {
              id: "phak_ch7_q5",
              q: "What is the main advantage of a constant-speed propeller over a fixed-pitch propeller?",
              opts: [
                "It is lighter and simpler in design",
                          "It converts a higher percentage of brake horsepower into thrust horsepower over a wide range of rpm and airspeed combinations",
                          "It eliminates the need for a tachometer",
                          "It requires no pilot input during flight"
              ],
              ans: 1,
              exp: "The main advantage of a constant-speed propeller is that it converts a high percentage of BHP into THP over a wide range of rpm and airspeed combinations, allowing selection of the most efficient rpm for given conditions.",
              ref: { pdf: 2, page: 168, bookPage: "Ch7" }
            },
            {
              id: "phak_ch7_q6",
              q: "What does a climb propeller have compared to a cruise propeller?",
              opts: [
                "A higher pitch and more drag",
                          "A lower pitch and less drag",
                          "A higher pitch and less drag",
                          "The same pitch but a larger diameter"
              ],
              ans: 1,
              exp: "A climb propeller has a lower pitch and therefore less drag, resulting in higher rpm and more horsepower for takeoffs and climbs, but decreased cruise performance.",
              ref: { pdf: 2, page: 167, bookPage: "Ch7" }
            },
            {
              id: "phak_ch7_q7",
              q: "In a four-stroke reciprocating engine, what happens during the power stroke?",
              opts: [
                "The intake valve opens and the fuel-air mixture is drawn into the cylinder",
                          "The fuel-air mixture is ignited, forcing the piston downward and turning the crankshaft",
                          "The exhaust valve opens and burned gases are purged from the cylinder",
                          "The piston compresses the fuel-air mixture to obtain greater power output"
              ],
              ans: 1,
              exp: "During the power stroke, the fuel-air mixture is ignited, causing a tremendous pressure increase that forces the piston downward, creating the power that turns the crankshaft.",
              ref: { pdf: 2, page: 165, bookPage: "Ch7" }
            },
            {
              id: "phak_ch7_q8",
              q: "What does FADEC stand for and what is its advantage?",
              opts: [
                "Frequency Amplitude Digital Engine Control; it increases engine weight",
                          "Full Authority Digital Engine Control; it minimizes complication of engine control",
                          "Fast Acting Digital Engine Circuit; it reduces fuel tank capacity",
                          "Federal Aviation Digital Engine Certification; it is required for all spark-ignition engines"
              ],
              ans: 1,
              exp: "FADEC stands for Full Authority Digital Engine Control and is standard on many jet-fueled piston engine aircraft, minimizing the complication of engine control.",
              ref: { pdf: 2, page: 165, bookPage: "Ch7" }
            },
            {
              id: "phak_ch7_q9",
              q: "What color arc on a tachometer indicates the maximum continuous operating rpm?",
              opts: [
                "A red arc",
                          "A yellow arc",
                          "A green arc",
                          "A white arc"
              ],
              ans: 2,
              exp: "A tachometer is color coded with a green arc denoting the maximum continuous operating rpm, with some tachometers having additional markings for engine and propeller limitations.",
              ref: { pdf: 2, page: 167, bookPage: "Ch7" }
            },
            {
              id: "phak_ch7_q10",
              q: "What is the primary purpose of the induction air filter in a reciprocating engine?",
              opts: [
                "To increase the temperature of the incoming air",
                          "To prevent foreign matter from entering the engine induction system",
                          "To mix fuel with air before it enters the cylinders",
                          "To reduce the pressure of the incoming air"
              ],
              ans: 1,
              exp: "The induction air filter is used to prevent foreign matter from entering the engine induction system, protecting the engine from debris that could cause damage.",
              ref: { pdf: 2, page: 170, bookPage: "Ch7" }
            }
        ]
      }
    ]
  },
  phak_ch8: {
    title: "PHAK Ch8: Flight Manuals and Documents",
    sections: [
      {
        title: "Chapter 8 Key Concepts",
        sectionRef: "PHAK Ch8",
        questions: [
            {
              id: "phak_ch8_q1",
              q: "Which flight instruments utilize the pitot-static system?",
              opts: [
                "Attitude indicator, heading indicator, and turn coordinator",
                          "Airspeed indicator, altimeter, and vertical speed indicator",
                          "Altimeter, heading indicator, and airspeed indicator",
                          "Vertical speed indicator, attitude indicator, and altimeter"
              ],
              ans: 1,
              exp: "The combined pressures of the pitot-static system are utilized for the operation of the airspeed indicator (ASI), altimeter, and vertical speed indicator (VSI).",
              ref: { pdf: 2, page: 205, bookPage: "Ch8" }
            },
            {
              id: "phak_ch8_q2",
              q: "Which instrument utilizes the pitot tube (total pressure)?",
              opts: [
                "The altimeter",
                          "The airspeed indicator",
                          "The vertical speed indicator",
                          "The attitude indicator"
              ],
              ans: 1,
              exp: "The one instrument that utilizes the pitot tube is the ASI. Total pressure is transmitted from the pitot tube to the ASI.",
              ref: { pdf: 2, page: 206, bookPage: "Ch8" }
            },
            {
              id: "phak_ch8_q3",
              q: "When starting a turn from a northerly heading, what error does the magnetic compass display?",
              opts: [
                "The compass leads the turn",
                          "The compass lags behind the turn",
                          "The compass shows the correct heading immediately",
                          "The compass oscillates wildly with no usable indication"
              ],
              ans: 1,
              exp: "When starting a turn from a northerly heading, the compass lags behind the turn. From a southerly heading, it leads the turn.",
              ref: { pdf: 2, page: 231, bookPage: "Ch8" }
            },
            {
              id: "phak_ch8_q4",
              q: "What is the purpose of the alternate static source?",
              opts: [
                "To provide backup pitot pressure if the pitot tube is blocked",
                          "To provide static pressure should the primary static source become blocked",
                          "To supply vacuum pressure for the gyroscopic instruments",
                          "To heat the pitot tube in icing conditions"
              ],
              ans: 1,
              exp: "An alternate static source is provided in some aircraft to provide static pressure should the primary static source become blocked.",
              ref: { pdf: 2, page: 206, bookPage: "Ch8" }
            },
            {
              id: "phak_ch8_q5",
              q: "When the alternate static source is used, how does the airspeed indicator read?",
              opts: [
                "It indicates an airspeed lower than actual",
                          "It indicates an airspeed greater than actual",
                          "It shows no change from normal operation",
                          "It fluctuates rapidly and is unusable"
              ],
              ans: 1,
              exp: "When the alternate static source pressure is used, the ASI indicates an airspeed greater than the actual airspeed due to the lower pressure inside the flight deck from the venturi effect.",
              ref: { pdf: 2, page: 207, bookPage: "Ch8" }
            },
            {
              id: "phak_ch8_q6",
              q: "What is the old aviation axiom for flying from a high pressure area to a low pressure area without adjusting the altimeter?",
              opts: [
                "\"FROM A LOW TO A HIGH, LOOK OUT BELOW\"",
                          "\"GOING FROM A HIGH TO A LOW, LOOK OUT BELOW\"",
                          "\"HIGH TO LOW, PRECIPITOUS DROP\"",
                          "\"PRESSURE FALLING, CAUTION CALLING\""
              ],
              ans: 1,
              exp: "The axiom is 'GOING FROM A HIGH TO A LOW, LOOK OUT BELOW.' When flying from high to low pressure without adjusting the altimeter, the actual altitude is lower than indicated.",
              ref: { pdf: 2, page: 208, bookPage: "Ch8" }
            },
            {
              id: "phak_ch8_q7",
              q: "What does the Kollsman window on an altimeter display?",
              opts: [
                "The aircraft's true altitude in feet",
                          "The barometric pressure setting",
                          "The outside air temperature",
                          "The density altitude"
              ],
              ans: 1,
              exp: "The Kollsman window is the barometric pressure setting window on the altimeter, calibrated in inches of mercury and/or millibars, used to adjust for nonstandard pressure.",
              ref: { pdf: 2, page: 209, bookPage: "Ch8" }
            },
            {
              id: "phak_ch8_q8",
              q: "What altimeter error can exist when operating in extremely cold temperatures?",
              opts: [
                "The altimeter reads lower than the actual altitude",
                          "The altimeter reads higher than the actual altitude (aircraft is lower than indicated)",
                          "The altimeter becomes completely inoperable",
                          "No error exists because temperature does not affect the altimeter"
              ],
              ans: 1,
              exp: "When flying into colder-than-standard temperatures while maintaining constant indicated altitude, true altitude is lower. The colder the air, the greater the error, placing the aircraft lower than the altimeter indicates.",
              ref: { pdf: 2, page: 209, bookPage: "Ch8" }
            },
            {
              id: "phak_ch8_q9",
              q: "What happens to the altimeter indication when the barometric pressure setting window is set to a lower pressure than actual?",
              opts: [
                "The altimeter indicates a lower altitude than the aircraft's actual altitude",
                          "The altimeter indicates a higher altitude than the aircraft's actual altitude",
                          "The altimeter indicates the correct altitude regardless",
                          "The vertical speed indicator becomes the primary reference"
              ],
              ans: 0,
              exp: "When the actual pressure is lower than what is set in the altimeter window, the actual altitude of the aircraft is lower than what is indicated on the altimeter. A lower pressure setting causes the altimeter to read lower.",
              ref: { pdf: 2, page: 210, bookPage: "Ch8" }
            },
            {
              id: "phak_ch8_q10",
              q: "What are the two fundamental properties of gyroscopic action?",
              opts: [
                "Centrifugal force and centripetal acceleration",
                          "Rigidity in space and precession",
                          "Angular velocity and linear momentum",
                          "Torque and rotational inertia"
              ],
              ans: 1,
              exp: "The two fundamental properties of gyroscopic action are rigidity in space (the gyro remains fixed in its plane of rotation) and precession (tilting of the gyro in response to a deflective force, occurring 90° later in the direction of rotation).",
              ref: { pdf: 2, page: 220, bookPage: "Ch8" }
            }
        ]
      }
    ]
  },
  phak_ch9: {
    title: "PHAK Ch9: Weight and Balance",
    sections: [
      {
        title: "Chapter 9 Key Concepts",
        sectionRef: "PHAK Ch9",
        questions: [
            {
              id: "phak_ch9_q1",
              q: "What is the difference between an AFM and an aircraft owner/information manual?",
              opts: [
                "The AFM is approved by the FAA and specific to a particular aircraft; the owner's manual is not FAA-approved",
                          "The AFM is published by the pilot; the owner's manual is published by the FAA",
                          "The AFM only contains performance data; the owner's manual contains all operating procedures",
                          "There is no difference; the terms are interchangeable"
              ],
              ans: 0,
              exp: "An AFM is FAA-approved and contains information specific to a particular make/model by serial number. The owner/information manual is not FAA-approved and not specific to an individual aircraft.",
              ref: { pdf: 2, page: 234, bookPage: "Ch9" }
            },
            {
              id: "phak_ch9_q2",
              q: "On an airspeed indicator, what does the yellow arc represent?",
              opts: [
                "The flap operating range",
                          "The normal operating speed range",
                          "The speed range between VNO and VNE (caution range)",
                          "The never-exceed speed"
              ],
              ans: 2,
              exp: "A yellow arc indicates the speed range between maximum structural cruising speed (VNO) and VNE. Operation in this range is for smooth air only with caution.",
              ref: { pdf: 2, page: 234, bookPage: "Ch9" }
            },
            {
              id: "phak_ch9_q3",
              q: "Which section of the POH typically has a red tab for quick identification?",
              opts: [
                "The Limitations section",
                          "The Emergency Procedures section",
                          "The Performance section",
                          "The Weight and Balance section"
              ],
              ans: 1,
              exp: "The Emergency Procedures section may have a red tab for quick identification and reference.",
              ref: { pdf: 2, page: 234, bookPage: "Ch9" }
            },
            {
              id: "phak_ch9_q4",
              q: "What is an Airworthiness Directive (AD)?",
              opts: [
                "A document issued by the aircraft manufacturer recommending optional upgrades",
                          "A regulatory notice requiring corrective action on an aircraft product found to be unsafe",
                          "A pilot's guide for conducting preflight inspections",
                          "A certificate issued to confirm an aircraft is safe to fly"
              ],
              ans: 1,
              exp: "An AD is a regulatory notice informing aircraft owners of a condition that makes a product unsafe and requiring corrective action.",
              ref: { pdf: 2, page: 245, bookPage: "Ch9" }
            },
            {
              id: "phak_ch9_q5",
              q: "How long is a pink copy of the Aircraft Registration Application (AC Form 8050-1) valid for operating an unregistered aircraft?",
              opts: [
                "30 days",
                          "90 days",
                          "6 months",
                          "1 year"
              ],
              ans: 1,
              exp: "The pink copy of the application for an Aircraft Registration Application provides authorization to operate an unregistered aircraft for a period not to exceed 90 days.",
              ref: { pdf: 2, page: 239, bookPage: "Ch9" }
            },
            {
              id: "phak_ch9_q6",
              q: "What does GAMA Specification No. 1 establish?",
              opts: [
                "Minimum pilot training requirements for general aviation aircraft",
                          "A standardized format for all general aviation airplane and helicopter flight manuals",
                          "Weight and balance computation standards for transport aircraft",
                          "Airworthiness certification requirements for light sport aircraft"
              ],
              ans: 1,
              exp: "GAMA Specification No. 1 established a standardized format for all general aviation airplane and helicopter flight manuals, which is now the standard for AFM/POH organization.",
              ref: { pdf: 2, page: 234, bookPage: "Ch9" }
            },
            {
              id: "phak_ch9_q7",
              q: "In a multi-engine airspeed indicator, what does a blue radial line indicate?",
              opts: [
                "Maximum flap extended speed (VFE)",
                          "Single-engine best rate of climb speed at maximum weight at sea level (VYSE)",
                          "Never-exceed speed (VNE)",
                          "Minimum controllable airspeed (VMC)"
              ],
              ans: 1,
              exp: "A blue radial line on multi-engine airplane ASIs indicates single-engine best rate of climb speed at maximum weight at sea level (VYSE), while a red radial line indicates VMC.",
              ref: { pdf: 2, page: 235, bookPage: "Ch9" }
            },
            {
              id: "phak_ch9_q8",
              q: "What section of the POH contains information about optional systems such as autopilots and navigation systems?",
              opts: [
                "Systems Description (Section 7)",
                          "Supplements (Section 9)",
                          "Performance (Section 5)",
                          "Equipment List (Section 6)"
              ],
              ans: 1,
              exp: "The Supplements section (Section 9) contains information necessary to operate the aircraft when equipped with optional systems such as autopilots, navigation systems, and air-conditioning.",
              ref: { pdf: 2, page: 237, bookPage: "Ch9" }
            },
            {
              id: "phak_ch9_q9",
              q: "According to 14 CFR part 91, what must pilots comply with regarding operating limitations?",
              opts: [
                "Only the aircraft's weight and balance restrictions",
                          "The operating limitations specified in the approved flight manuals, markings, and placards",
                          "Only the airspeed limitations shown on the ASI",
                          "Recommendations from the aircraft owner's manual"
              ],
              ans: 1,
              exp: "14 CFR part 91 requires that pilots comply with the operating limitations specified in the approved flight manuals, markings, and placards of the aircraft.",
              ref: { pdf: 2, page: 234, bookPage: "Ch9" }
            },
            {
              id: "phak_ch9_q10",
              q: "What must be included on the title page of an AFM/POH to identify the specific aircraft it belongs to?",
              opts: [
                "The pilot's name and certificate number",
                          "The serial number and registration number of the aircraft",
                          "The date of manufacture and total airframe hours",
                          "The name and address of the previous owner"
              ],
              ans: 1,
              exp: "Manufacturers are required to include the serial number and registration on the title page to identify the aircraft to which the manual belongs. Without these, the manual is limited to general study purposes only.",
              ref: { pdf: 2, page: 234, bookPage: "Ch9" }
            }
        ]
      }
    ]
  },
  phak_ch10: {
    title: "PHAK Ch10: Aircraft Performance",
    sections: [
      {
        title: "Chapter 10 Key Concepts",
        sectionRef: "PHAK Ch10",
        questions: [
            {
              id: "phak_ch10_q1",
              q: "What is the primary concern when balancing an aircraft?",
              opts: [
                "The lateral location of the CG",
                          "The fore and aft location of the CG along the longitudinal axis",
                          "The vertical location of the CG",
                          "The total weight of all passengers"
              ],
              ans: 1,
              exp: "The primary concern in balancing an aircraft is the fore and aft location of the CG along the longitudinal axis.",
              ref: { pdf: 2, page: 248, bookPage: "Ch10" }
            },
            {
              id: "phak_ch10_q2",
              q: "What is a consequence of operating an aircraft with the CG too far forward?",
              opts: [
                "A tail-heavy condition",
                          "A nose-heavy condition",
                          "Increased stall speed only",
                          "Reduced range"
              ],
              ans: 1,
              exp: "If the CG is displaced too far forward, a nose-heavy condition results. If too far aft, a tail-heavy condition results.",
              ref: { pdf: 2, page: 248, bookPage: "Ch10" }
            },
            {
              id: "phak_ch10_q3",
              q: "Which of the following is an effect of excessive weight on aircraft performance?",
              opts: [
                "Shorter takeoff run",
                          "Higher rate of climb",
                          "Higher stalling speed",
                          "Increased maximum altitude"
              ],
              ans: 2,
              exp: "Excessive weight results in higher stalling speed, longer takeoff run, reduced rate of climb, and other performance deficiencies.",
              ref: { pdf: 2, page: 248, bookPage: "Ch10" }
            },
            {
              id: "phak_ch10_q4",
              q: "During flight, what is normally the only weight change that takes place?",
              opts: [
                "Passenger movement",
                          "Fuel burn",
                          "Water evaporation from cabin",
                          "Oil consumption"
              ],
              ans: 1,
              exp: "During flight, fuel burn is normally the only weight change that takes place, making the aircraft lighter and improving performance.",
              ref: { pdf: 2, page: 248, bookPage: "Ch10" }
            },
            {
              id: "phak_ch10_q5",
              q: "What is the standard weight of gasoline used in weight and balance computations?",
              opts: [
                "6.8 lb/US gal",
                          "6.0 lb/US gal",
                          "7.5 lb/US gal",
                          "8.35 lb/US gal"
              ],
              ans: 1,
              exp: "The standard weight for gasoline is 6 lb/US gal. Other standard weights include Jet A at 6.8 lb/gal, oil at 7.5 lb/gal, and water at 8.35 lb/gal.",
              ref: { pdf: 2, page: 251, bookPage: "Ch10" }
            },
            {
              id: "phak_ch10_q6",
              q: "What is the useful load of a general aviation aircraft?",
              opts: [
                "The maximum zero fuel weight minus basic empty weight",
                          "The weight of the pilot, copilot, passengers, baggage, usable fuel, and drainable oil",
                          "The maximum ramp weight minus the maximum landing weight",
                          "The weight of all permanently installed equipment and fluids"
              ],
              ans: 1,
              exp: "Useful load is the weight of the pilot, copilot, passengers, baggage, usable fuel, and drainable oil, calculated as basic empty weight subtracted from maximum allowable gross weight.",
              ref: { pdf: 2, page: 251, bookPage: "Ch10" }
            },
            {
              id: "phak_ch10_q7",
              q: "According to AC 43.13-1, what is considered a negligible weight change for an aircraft with empty weight less than 5,000 pounds?",
              opts: [
                "5 pounds or less",
                          "2 pounds or less",
                          "1 pound or less",
                          "10 pounds or less"
              ],
              ans: 2,
              exp: "For an aircraft with empty weight less than 5,000 pounds, a weight change of 1 pound or less is considered negligible and does not require a weight and balance check.",
              ref: { pdf: 2, page: 250, bookPage: "Ch10" }
            },
            {
              id: "phak_ch10_q8",
              q: "Where is the CG typically located in relation to the center of lift?",
              opts: [
                "Exactly at the center of lift",
                          "Slightly forward of the center of lift",
                          "Slightly aft of the center of lift",
                          "The position varies randomly depending on loading"
              ],
              ans: 1,
              exp: "To provide the necessary balance between longitudinal stability and elevator control, the CG is usually located slightly forward of the center of lift, causing a desirable nose-down tendency at slow speeds.",
              ref: { pdf: 2, page: 252, bookPage: "Ch10" }
            },
            {
              id: "phak_ch10_q9",
              q: "What is a moment in weight and balance computations?",
              opts: [
                "The distance from the datum to the CG of an item",
                          "The product of the weight of an item multiplied by its arm, expressed in pound-inches",
                          "The maximum weight the floor can sustain per square inch",
                          "The difference between maximum takeoff weight and maximum landing weight"
              ],
              ans: 1,
              exp: "A moment is the product of the weight of an item multiplied by its arm (distance from the datum), expressed in pound-inches (in-lb).",
              ref: { pdf: 2, page: 251, bookPage: "Ch10" }
            },
            {
              id: "phak_ch10_q10",
              q: "Under 14 CFR part 125, how often must aircraft with 20 or more seats be weighed?",
              opts: [
                "Every 12 calendar months",
                          "Every 24 calendar months",
                          "Every 36 calendar months",
                          "Every 48 calendar months"
              ],
              ans: 2,
              exp: "14 CFR part 125 requires aircraft with 20 or more seats or maximum payload capacity of 6,000 pounds or more to be weighed every 36 calendar months.",
              ref: { pdf: 2, page: 250, bookPage: "Ch10" }
            }
        ]
      }
    ]
  },
  phak_ch11: {
    title: "PHAK Ch11: Weather Theory",
    sections: [
      {
        title: "Chapter 11 Key Concepts",
        sectionRef: "PHAK Ch11",
        questions: [
            {
              id: "phak_ch11_q1",
              q: "What are the standard sea level temperature and pressure values?",
              opts: [
                "59 °F and 29.92 inches of mercury",
                          "50 °F and 29.00 inches of mercury",
                          "59 °F and 30.00 inches of mercury",
                          "70 °F and 29.92 inches of mercury"
              ],
              ans: 0,
              exp: "The standard atmosphere at sea level has a temperature of 59 °F and pressure of 29.92 inches of mercury.",
              ref: { pdf: 2, page: 260, bookPage: "Ch11" }
            },
            {
              id: "phak_ch11_q2",
              q: "What is the standard temperature lapse rate up to 36,000 feet?",
              opts: [
                "3.5 °F per 1,000 feet",
                          "2.0 °F per 1,000 feet",
                          "5.0 °F per 1,000 feet",
                          "1.0 °F per 1,000 feet"
              ],
              ans: 0,
              exp: "A standard temperature lapse rate decreases at approximately 3.5 °F or 2 °C per thousand feet up to 36,000 feet.",
              ref: { pdf: 2, page: 260, bookPage: "Ch11" }
            },
            {
              id: "phak_ch11_q3",
              q: "As air becomes less dense, what three effects on aircraft performance occur?",
              opts: [
                "Increased power, thrust, and lift",
                          "Reduced power, thrust, and lift",
                          "Increased thrust but reduced lift and power",
                          "No significant change to power, thrust, or lift"
              ],
              ans: 1,
              exp: "As air becomes less dense, it reduces power (engine takes in less air), thrust (propeller less efficient), and lift (thin air exerts less force on airfoils).",
              ref: { pdf: 2, page: 260, bookPage: "Ch11" }
            },
            {
              id: "phak_ch11_q4",
              q: "Transport category aircraft are certificated under which 14 CFR part?",
              opts: [
                "14 CFR part 23",
                          "14 CFR part 25",
                          "14 CFR part 27",
                          "14 CFR part 29"
              ],
              ans: 1,
              exp: "Transport category aircraft are certificated under 14 CFR part 25. Transport category helicopters are under 14 CFR part 29.",
              ref: { pdf: 2, page: 286, bookPage: "Ch11" }
            },
            {
              id: "phak_ch11_q5",
              q: "What is the definition of VY?",
              opts: [
                "The speed at which the aircraft obtains the maximum angle of climb",
                          "The speed at which the aircraft obtains the maximum rate of climb",
                          "The maximum flap extended speed",
                          "The stall speed in the landing configuration"
              ],
              ans: 1,
              exp: "VY is defined as the speed at which the aircraft obtains the maximum rate of climb (ROC), which achieves the greatest altitude gain over a given period of time.",
              ref: { pdf: 2, page: 265, bookPage: "Ch11" }
            },
            {
              id: "phak_ch11_q6",
              q: "What is flight in the region of reversed command?",
              opts: [
                "Flight where higher airspeed produces higher rate of climb",
                          "Flight where higher airspeed produces a higher power requirement and lower airspeed produces lower power requirement",
                          "Flight where higher airspeed produces lower power required and lower airspeed produces higher power required",
                          "Flight where the aircraft flies backwards relative to the ground"
              ],
              ans: 2,
              exp: "The region of reversed command is flight in which a higher airspeed requires a lower power setting and a lower airspeed requires a higher power setting to maintain altitude.",
              ref: { pdf: 2, page: 275, bookPage: "Ch11" }
            },
            {
              id: "phak_ch11_q7",
              q: "What is the approximate effect of a headwind that is 10 percent of the takeoff airspeed on takeoff distance?",
              opts: [
                "It increases takeoff distance by approximately 19 percent",
                          "It reduces takeoff distance by approximately 19 percent",
                          "It has no significant effect on takeoff distance",
                          "It reduces takeoff distance by approximately 50 percent"
              ],
              ans: 1,
              exp: "A headwind that is 10 percent of the takeoff airspeed reduces the takeoff distance approximately 19 percent, while a tailwind of the same proportion increases takeoff distance approximately 21 percent.",
              ref: { pdf: 2, page: 277, bookPage: "Ch11" }
            },
            {
              id: "phak_ch11_q8",
              q: "What formula approximates the minimum speed at which dynamic hydroplaning begins?",
              opts: [
                "Square root of tire pressure in psi multiplied by 7",
                          "Square root of tire pressure in psi multiplied by 9",
                          "Tire pressure in psi divided by 5",
                          "Tire pressure in psi multiplied by 2"
              ],
              ans: 1,
              exp: "The minimum hydroplaning speed is approximately the square root of the tire pressure in psi multiplied by 9. For example, at 36 psi, hydroplaning could begin at 54 knots.",
              ref: { pdf: 2, page: 280, bookPage: "Ch11" }
            },
            {
              id: "phak_ch11_q9",
              q: "What is the service ceiling of an aircraft?",
              opts: [
                "The maximum altitude the aircraft can reach",
                          "The altitude at which the aircraft is unable to climb at a rate greater than 100 fpm",
                          "The altitude at which the aircraft reaches zero rate of climb",
                          "The maximum altitude for which the engine is certified"
              ],
              ans: 1,
              exp: "The service ceiling is the altitude at which the aircraft is unable to climb at a rate greater than 100 fpm. The absolute ceiling is where zero ROC exists.",
              ref: { pdf: 2, page: 267, bookPage: "Ch11" }
            },
            {
              id: "phak_ch11_q10",
              q: "What is the effect of humidity on aircraft performance?",
              opts: [
                "High humidity increases air density, improving performance",
                          "High humidity decreases air density, reducing performance",
                          "Humidity has no effect on aircraft performance",
                          "High humidity increases engine power output"
              ],
              ans: 1,
              exp: "Water vapor is lighter than air, so moist air is less dense than dry air. As water content increases, air becomes less dense, increasing density altitude and decreasing performance.",
              ref: { pdf: 2, page: 263, bookPage: "Ch11" }
            }
        ]
      }
    ]
  },
  phak_ch12: {
    title: "PHAK Ch12: Weather Services",
    sections: [
      {
        title: "Chapter 12 Key Concepts",
        sectionRef: "PHAK Ch12",
        questions: [
            {
              id: "phak_ch12_q1",
              q: "What percentage of the atmosphere is nitrogen?",
              opts: [
                "21 percent",
                          "78 percent",
                          "1 percent",
                          "50 percent"
              ],
              ans: 1,
              exp: "In any given volume of air, nitrogen accounts for 78 percent of the gases that comprise the atmosphere.",
              ref: { pdf: 2, page: 288, bookPage: "Ch12" }
            },
            {
              id: "phak_ch12_q2",
              q: "In which layer of the atmosphere does the vast majority of weather occur?",
              opts: [
                "Stratosphere",
                          "Troposphere",
                          "Mesosphere",
                          "Thermosphere"
              ],
              ans: 1,
              exp: "The vast majority of weather, clouds, storms, and temperature variances occur within the troposphere.",
              ref: { pdf: 2, page: 288, bookPage: "Ch12" }
            },
            {
              id: "phak_ch12_q3",
              q: "What is the greatest thunderstorm hazard to aircraft, along with turbulence?",
              opts: [
                "Lightning strikes",
                          "Hail",
                          "Engine water ingestion",
                          "Rapid pressure changes"
              ],
              ans: 1,
              exp: "Hail competes with turbulence as the greatest thunderstorm hazard to aircraft.",
              ref: { pdf: 2, page: 311, bookPage: "Ch12" }
            },
            {
              id: "phak_ch12_q4",
              q: "How much altimeter error can result from the rapid pressure changes associated with a thunderstorm?",
              opts: [
                "More than 100 feet",
                          "Exactly 50 feet",
                          "Less than 20 feet",
                          "No significant error"
              ],
              ans: 0,
              exp: "If the pilot does not receive a corrected altimeter setting, the altimeter may be more than 100 feet in error during a thunderstorm.",
              ref: { pdf: 2, page: 311, bookPage: "Ch12" }
            },
            {
              id: "phak_ch12_q5",
              q: "Why is frost a hazard to flight?",
              opts: [
                "It adds excessive weight to the aircraft",
                          "It disrupts airflow over the wing, reducing lift and increasing drag",
                          "It blocks the pitot tube, causing instrument errors",
                          "It reduces visibility through the windshield"
              ],
              ans: 1,
              exp: "Frost disrupts the flow of air over the wing and can drastically reduce the production of lift while also increasing drag, making it difficult or impossible to take off safely.",
              ref: { pdf: 2, page: 301, bookPage: "Ch12" }
            },
            {
              id: "phak_ch12_q6",
              q: "What are the three stages of a thunderstorm in order?",
              opts: [
                "Mature, cumulus, dissipating",
                          "Cumulus, mature, dissipating",
                          "Dissipating, cumulus, mature",
                          "Cumulus, dissipating, mature"
              ],
              ans: 1,
              exp: "A thunderstorm progresses through the cumulus stage (lifting action begins), the mature stage (most violent, with rain/hail falling), and the dissipating stage (downdrafts replace updrafts).",
              ref: { pdf: 2, page: 308, bookPage: "Ch12" }
            },
            {
              id: "phak_ch12_q7",
              q: "What is the typical lifespan of a microburst?",
              opts: [
                "1–2 minutes",
                          "5–15 minutes",
                          "30–45 minutes",
                          "1–2 hours"
              ],
              ans: 1,
              exp: "A microburst has a typical lifespan of 5–15 minutes, during which it can produce downdrafts of up to 6,000 fpm and headwind losses of 30–90 knots.",
              ref: { pdf: 2, page: 297, bookPage: "Ch12" }
            },
            {
              id: "phak_ch12_q8",
              q: "What condition creates an occluded front?",
              opts: [
                "When two cold air masses meet with no warm air between them",
                          "When a fast-moving cold front catches up with a slow-moving warm front",
                          "When a warm front overtakes a cold front",
                          "When a stationary front becomes unstable"
              ],
              ans: 1,
              exp: "An occluded front occurs when a fast-moving cold front catches up with a slow-moving warm front. Two types exist: cold front occlusion and warm front occlusion.",
              ref: { pdf: 2, page: 307, bookPage: "Ch12" }
            },
            {
              id: "phak_ch12_q9",
              q: "What type of fog forms when warm, moist air moves over a cold surface and requires wind to form?",
              opts: [
                "Radiation fog",
                          "Advection fog",
                          "Upslope fog",
                          "Steam fog"
              ],
              ans: 1,
              exp: "Advection fog forms when a layer of warm, moist air moves over a cold surface. Unlike radiation fog, wind (up to 15 knots) is required to form and intensify it.",
              ref: { pdf: 2, page: 301, bookPage: "Ch12" }
            },
            {
              id: "phak_ch12_q10",
              q: "What is the dry adiabatic lapse rate for unsaturated air?",
              opts: [
                "2 °C per 1,000 feet",
                          "3 °C per 1,000 feet",
                          "5 °C per 1,000 feet",
                          "1 °C per 1,000 feet"
              ],
              ans: 1,
              exp: "The dry adiabatic lapse rate for unsaturated air is 3 °C (5.4 °F) per 1,000 feet. The moist adiabatic lapse rate varies from 1.1 °C to 2.8 °C per 1,000 feet.",
              ref: { pdf: 2, page: 299, bookPage: "Ch12" }
            }
        ]
      }
    ]
  },
  phak_ch13: {
    title: "PHAK Ch13: Aviation Weather Services",
    sections: [
      {
        title: "Chapter 13 Key Concepts",
        sectionRef: "PHAK Ch13",
        questions: [
            {
              id: "phak_ch13_q1",
              q: "What is the ascent rate of a radiosonde balloon?",
              opts: [
                "Approximately 500 fpm",
                          "Approximately 1,000 fpm",
                          "Approximately 1,500 fpm",
                          "Approximately 2,000 fpm"
              ],
              ans: 1,
              exp: "A radiosonde balloon rises at a rate of approximately 1,000 feet per minute (fpm).",
              ref: { pdf: 2, page: 314, bookPage: "Ch13" }
            },
            {
              id: "phak_ch13_q2",
              q: "How often are images updated when the WSR-88D Doppler radar is in precipitation mode?",
              opts: [
                "Every 2 to 3 minutes",
                          "Every 4 to 6 minutes",
                          "Every 10 minutes",
                          "Every 15 minutes"
              ],
              ans: 1,
              exp: "In precipitation mode, a faster antenna rotation allows images to update approximately every 4 to 6 minutes.",
              ref: { pdf: 2, page: 315, bookPage: "Ch13" }
            },
            {
              id: "phak_ch13_q3",
              q: "What letters do ICAO station identifiers for Alaska always begin with?",
              opts: [
                "AK",
                          "PA",
                          "AL",
                          "PH"
              ],
              ans: 1,
              exp: "Alaska identifiers always begin with the letters 'PA'.",
              ref: { pdf: 2, page: 318, bookPage: "Ch13" }
            },
            {
              id: "phak_ch13_q4",
              q: "In a standard weather briefing, what information is presented FIRST?",
              opts: [
                "Current conditions",
                          "Synopsis",
                          "Adverse conditions",
                          "En route forecast"
              ],
              ans: 2,
              exp: "A standard briefing presents adverse conditions first, before any other information.",
              ref: { pdf: 2, page: 317, bookPage: "Ch13" }
            },
            {
              id: "phak_ch13_q5",
              q: "How often are TAF reports updated each day?",
              opts: [
                "Two times",
                          "Three times",
                          "Four times",
                          "Six times"
              ],
              ans: 2,
              exp: "TAF reports are updated four times a day at 0000Z, 0600Z, 1200Z, and 1800Z.",
              ref: { pdf: 2, page: 321, bookPage: "Ch13" }
            },
            {
              id: "phak_ch13_q6",
              q: "ATC facilities are required to solicit PIREPs when the ceiling is below what altitude or visibility is at or below what value?",
              opts: [
                "Ceiling below 3,000 ft / visibility 3 SM or less",
                          "Ceiling below 5,000 ft / visibility 5 SM or less",
                          "Ceiling below 1,000 ft / visibility 1 SM or less",
                          "Ceiling below 10,000 ft / visibility 5 SM or less"
              ],
              ans: 1,
              exp: "If the ceiling is below 5,000 feet or visibility at or below 5 miles, ATC facilities are required to solicit PIREPs.",
              ref: { pdf: 2, page: 320, bookPage: "Ch13" }
            },
            {
              id: "phak_ch13_q7",
              q: "Which AIRMET code is used to denote IFR conditions and mountain obscuration?",
              opts: [
                "Tango",
                          "Zulu",
                          "Sierra",
                          "Romeo"
              ],
              ans: 2,
              exp: "Sierra is the AIRMET code used to denote IFR and mountain obscuration.",
              ref: { pdf: 2, page: 323, bookPage: "Ch13" }
            },
            {
              id: "phak_ch13_q8",
              q: "How long is a SIGMET valid for, unless it relates to a hurricane?",
              opts: [
                "2 hours",
                          "4 hours",
                          "6 hours",
                          "8 hours"
              ],
              ans: 1,
              exp: "SIGMETs are unscheduled forecasts valid for 4 hours unless the SIGMET relates to a hurricane, in which case it is valid for 6 hours.",
              ref: { pdf: 2, page: 324, bookPage: "Ch13" }
            },
            {
              id: "phak_ch13_q9",
              q: "Convective SIGMETs are issued at what time past each hour?",
              opts: [
                "25 minutes past",
                          "35 minutes past",
                          "45 minutes past",
                          "55 minutes past"
              ],
              ans: 3,
              exp: "Convective SIGMETs are issued at 55 minutes past the hour.",
              ref: { pdf: 2, page: 324, bookPage: "Ch13" }
            },
            {
              id: "phak_ch13_q10",
              q: "How many area forecasts are published for the contiguous 48 states?",
              opts: [
                "Four",
                          "Six",
                          "Eight",
                          "Ten"
              ],
              ans: 1,
              exp: "There are six areas for which area forecasts are published in the contiguous 48 states.",
              ref: { pdf: 2, page: 322, bookPage: "Ch13" }
            }
        ]
      }
    ]
  },
  phak_ch14: {
    title: "PHAK Ch14: Airport Operations",
    sections: [
      {
        title: "Chapter 14 Key Concepts",
        sectionRef: "PHAK Ch14",
        questions: [
            {
              id: "phak_ch14_q1",
              q: "What does CTAF stand for?",
              opts: [
                "Controller Traffic Advisory Frequency",
                          "Common Traffic Advisory Frequency",
                          "Central Tower Advisory Frequency",
                          "Controlled Traffic Airspace Frequency"
              ],
              ans: 1,
              exp: "CTAF stands for Common Traffic Advisory Frequency.",
              ref: { pdf: 2, page: 338, bookPage: "Ch14" }
            },
            {
              id: "phak_ch14_q2",
              q: "Runway numbers are determined by reference to what direction?",
              opts: [
                "True north",
                          "Magnetic north",
                          "True south",
                          "Grid north"
              ],
              ans: 1,
              exp: "Runway numbers are in reference to magnetic north.",
              ref: { pdf: 2, page: 341, bookPage: "Ch14" }
            },
            {
              id: "phak_ch14_q3",
              q: "What is the portion of runway behind a displaced threshold available for?",
              opts: [
                "Landings only",
                          "Takeoffs in either direction and landings from the opposite direction",
                          "Takeoffs only",
                          "Neither takeoffs nor landings"
              ],
              ans: 1,
              exp: "The portion of runway behind a displaced threshold is available for takeoffs in either direction, or landings from the opposite direction.",
              ref: { pdf: 2, page: 341, bookPage: "Ch14" }
            },
            {
              id: "phak_ch14_q4",
              q: "What are the minimum weather requirements for a pilot to receive a LAHSO clearance?",
              opts: [
                "Ceiling 500 ft and 1 SM visibility",
                          "Ceiling 1,000 ft and 3 SM visibility",
                          "Ceiling 1,500 ft and 3 SM visibility",
                          "Ceiling 500 ft and 2 SM visibility"
              ],
              ans: 1,
              exp: "Pilots should only receive a LAHSO clearance when there is a minimum ceiling of 1,000 feet and 3 statute miles of visibility.",
              ref: { pdf: 2, page: 346, bookPage: "Ch14" }
            },
            {
              id: "phak_ch14_q5",
              q: "What glidepath angle is a 2-bar VASI normally set at?",
              opts: [
                "2.5 degrees",
                          "3 degrees",
                          "3.5 degrees",
                          "4 degrees"
              ],
              ans: 1,
              exp: "Two-bar VASI installations provide one visual glidepath that is normally set at 3 degrees.",
              ref: { pdf: 2, page: 352, bookPage: "Ch14" }
            },
            {
              id: "phak_ch14_q6",
              q: "What color are omnidirectional taxiway edge lights?",
              opts: [
                "Green",
                          "White",
                          "Blue",
                          "Yellow"
              ],
              ans: 2,
              exp: "Omnidirectional taxiway lights outline the edges of the taxiway and are blue in color.",
              ref: { pdf: 2, page: 355, bookPage: "Ch14" }
            },
            {
              id: "phak_ch14_q7",
              q: "What color combination does a civilian land airport beacon flash?",
              opts: [
                "White and yellow",
                          "White and green",
                          "White, yellow, and green",
                          "Green and white alternating"
              ],
              ans: 1,
              exp: "Civilian land airports are identified by flashing white and green beacon lights.",
              ref: { pdf: 2, page: 352, bookPage: "Ch14" }
            },
            {
              id: "phak_ch14_q8",
              q: "Which wind direction indicator allows a pilot to estimate wind velocity and gust factor?",
              opts: [
                "Tetrahedron",
                          "Wind tee",
                          "Wind sock",
                          "Landing strip indicator"
              ],
              ans: 2,
              exp: "The wind sock is a good source of information since it not only indicates wind direction but allows the pilot to estimate wind velocity and/or gust factor.",
              ref: { pdf: 2, page: 356, bookPage: "Ch14" }
            },
            {
              id: "phak_ch14_q9",
              q: "At what rate do wake turbulence vortices typically sink?",
              opts: [
                "Several hundred feet per minute",
                          "Several thousand feet per minute",
                          "10 to 20 feet per minute",
                          "50 to 100 feet per minute"
              ],
              ans: 0,
              exp: "Vortices sink at a rate of several hundred feet per minute, slowing their descent and diminishing with time.",
              ref: { pdf: 2, page: 364, bookPage: "Ch14" }
            },
            {
              id: "phak_ch14_q10",
              q: "How many possible transponder codes are there?",
              opts: [
                "1,024",
                          "2,048",
                          "4,096",
                          "8,192"
              ],
              ans: 2,
              exp: "A transponder code consists of four numbers from 0 to 7, providing 4,096 possible codes.",
              ref: { pdf: 2, page: 361, bookPage: "Ch14" }
            }
        ]
      }
    ]
  },
  phak_ch15: {
    title: "PHAK Ch15: Airspace",
    sections: [
      {
        title: "Chapter 15 Key Concepts",
        sectionRef: "PHAK Ch15",
        questions: [
            {
              id: "phak_ch15_q1",
              q: "What altitude range defines Class A airspace?",
              opts: [
                "14,500 ft MSL to FL 600",
                          "18,000 ft MSL to FL 600",
                          "10,000 ft MSL to FL 600",
                          "18,000 ft MSL to FL 450"
              ],
              ans: 1,
              exp: "Class A airspace extends from 18,000 feet MSL up to and including FL 600.",
              ref: { pdf: 2, page: 379, bookPage: "Ch15" }
            },
            {
              id: "phak_ch15_q2",
              q: "What is the maximum altitude of Class B airspace?",
              opts: [
                "8,000 ft MSL",
                          "10,000 ft MSL",
                          "12,000 ft MSL",
                          "14,500 ft MSL"
              ],
              ans: 1,
              exp: "Class B airspace extends from the surface to 10,000 feet MSL surrounding the nation's busiest airports.",
              ref: { pdf: 2, page: 379, bookPage: "Ch15" }
            },
            {
              id: "phak_ch15_q3",
              q: "What are the inner and outer circle radii of Class C airspace?",
              opts: [
                "3 NM inner, 8 NM outer",
                          "5 NM inner, 10 NM outer",
                          "5 NM inner, 15 NM outer",
                          "8 NM inner, 12 NM outer"
              ],
              ans: 1,
              exp: "Class C airspace usually consists of a surface area with a 5 NM radius and an outer circle with a 10 NM radius.",
              ref: { pdf: 2, page: 379, bookPage: "Ch15" }
            },
            {
              id: "phak_ch15_q4",
              q: "Class D airspace extends from the surface to what height above the airport elevation?",
              opts: [
                "2,000 ft",
                          "2,500 ft",
                          "3,000 ft",
                          "4,000 ft"
              ],
              ans: 1,
              exp: "Class D airspace extends from the surface to 2,500 feet above the airport elevation.",
              ref: { pdf: 2, page: 379, bookPage: "Ch15" }
            },
            {
              id: "phak_ch15_q5",
              q: "What airspace is designated as uncontrolled airspace?",
              opts: [
                "Class E",
                          "Class G",
                          "Class D",
                          "Class B"
              ],
              ans: 1,
              exp: "Uncontrolled airspace is designated Class G airspace, which has not been designated as Class A, B, C, D, or E.",
              ref: { pdf: 2, page: 380, bookPage: "Ch15" }
            },
            {
              id: "phak_ch15_q6",
              q: "How are Military Operation Areas (MOAs) depicted on aeronautical charts?",
              opts: [
                "With an M followed by a number",
                          "With a name but no number",
                          "With an R followed by a number",
                          "With a W followed by a number"
              ],
              ans: 1,
              exp: "MOAs are depicted on sectional, VFR terminal area, and en route low altitude charts and are not numbered (e.g., 'Camden Ridge MOA').",
              ref: { pdf: 2, page: 381, bookPage: "Ch15" }
            },
            {
              id: "phak_ch15_q7",
              q: "What are the basic VFR weather minimums in Class G airspace at night, more than 1,200 ft above the surface but less than 10,000 ft MSL?",
              opts: [
                "1 SM visibility, clear of clouds",
                          "3 SM visibility, 1,000 ft above, 500 ft below, 2,000 ft horizontal",
                          "5 SM visibility, 1,000 ft above, 1,000 ft below, 1 SM horizontal",
                          "3 SM visibility, clear of clouds"
              ],
              ans: 1,
              exp: "In Class G airspace at night, more than 1,200 ft above the surface but less than 10,000 ft MSL, basic VFR minimums are 3 SM visibility and cloud clearance of 1,000 ft above, 500 ft below, and 2,000 ft horizontal.",
              ref: { pdf: 2, page: 385, bookPage: "Ch15" }
            },
            {
              id: "phak_ch15_q8",
              q: "What are the VFR weather minimums for Class B airspace?",
              opts: [
                "3 SM visibility, 1,000 ft above, 500 ft below, 2,000 ft horizontal",
                          "3 SM visibility, clear of clouds",
                          "5 SM visibility, clear of clouds",
                          "3 SM visibility, 1,000 ft above, 1,000 ft below, 1 SM horizontal"
              ],
              ans: 1,
              exp: "In Class B airspace, VFR minimums are 3 statute miles visibility and clear of clouds.",
              ref: { pdf: 2, page: 385, bookPage: "Ch15" }
            },
            {
              id: "phak_ch15_q9",
              q: "What type of NOTAM is used to designate a Temporary Flight Restriction (TFR)?",
              opts: [
                "A center NOTAM",
                          "An FDC NOTAM",
                          "A local NOTAM",
                          "A domestic NOTAM"
              ],
              ans: 1,
              exp: "A flight data center (FDC) NOTAM is issued to designate a TFR.",
              ref: { pdf: 2, page: 383, bookPage: "Ch15" }
            },
            {
              id: "phak_ch15_q10",
              q: "Is participation in Terminal Radar Service Area (TRSA) services voluntary for VFR pilots?",
              opts: [
                "No, it is mandatory",
                          "Yes, it is voluntary",
                          "Only for IFR aircraft",
                          "Only at night"
              ],
              ans: 1,
              exp: "Participation in TRSA services is voluntary; however, pilots operating under VFR are encouraged to participate.",
              ref: { pdf: 2, page: 384, bookPage: "Ch15" }
            }
        ]
      }
    ]
  },
  phak_ch16: {
    title: "PHAK Ch16: Navigation",
    sections: [
      {
        title: "Chapter 16 Key Concepts",
        sectionRef: "PHAK Ch16",
        questions: [
            {
              id: "phak_ch16_q1",
              q: "What is the scale of a VFR sectional chart?",
              opts: [
                "1:100,000",
                          "1:250,000",
                          "1:500,000",
                          "1:1,000,000"
              ],
              ans: 2,
              exp: "Sectional charts have a scale of 1:500,000 (1 inch = 6.86 NM).",
              ref: { pdf: 2, page: 391, bookPage: "Ch16" }
            },
            {
              id: "phak_ch16_q2",
              q: "To convert knots to miles per hour, multiply by what factor?",
              opts: [
                "1.05",
                          "1.15",
                          "1.25",
                          "1.35"
              ],
              ans: 1,
              exp: "To convert knots to mph, multiply speed in knots by 1.15.",
              ref: { pdf: 2, page: 400, bookPage: "Ch16" }
            },
            {
              id: "phak_ch16_q3",
              q: "What is the mnemonic phrase used to remember how to apply magnetic variation?",
              opts: [
                "East is least (subtract), west is best (add)",
                          "East is best (add), west is least (subtract)",
                          "North adds, south subtracts",
                          "Add east, subtract west"
              ],
              ans: 0,
              exp: "The phrase is 'east is least (subtract) and west is best (add).'",
              ref: { pdf: 2, page: 397, bookPage: "Ch16" }
            },
            {
              id: "phak_ch16_q4",
              q: "What frequency band do VOR ground stations transmit within?",
              opts: [
                "118.0 to 136.975 MHz",
                          "108.0 to 117.95 MHz",
                          "200 to 415 kHz",
                          "960 to 1215 MHz"
              ],
              ans: 1,
              exp: "VOR ground stations transmit within a VHF frequency band of 108.0 to 117.95 MHz.",
              ref: { pdf: 2, page: 411, bookPage: "Ch16" }
            },
            {
              id: "phak_ch16_q5",
              q: "What is the maximum permissible variation between two VOR indications during a dual receiver check?",
              opts: [
                "2 degrees",
                          "4 degrees",
                          "6 degrees",
                          "8 degrees"
              ],
              ans: 1,
              exp: "The maximum permissible variation between two VOR receivers tuned to the same station is 4 degrees.",
              ref: { pdf: 2, page: 412, bookPage: "Ch16" }
            },
            {
              id: "phak_ch16_q6",
              q: "What type of distance does DME measure?",
              opts: [
                "Horizontal distance",
                          "Slant range distance",
                          "Great circle distance",
                          "GPS-predicted distance"
              ],
              ans: 1,
              exp: "DME measures the slant range distance of an aircraft from a VOR/DME or VORTAC.",
              ref: { pdf: 2, page: 416, bookPage: "Ch16" }
            },
            {
              id: "phak_ch16_q7",
              q: "What is the minimum number of satellites required for a GPS receiver to establish an accurate three-dimensional position?",
              opts: [
                "Three",
                          "Four",
                          "Five",
                          "Six"
              ],
              ans: 1,
              exp: "A minimum of four satellites is necessary to establish an accurate three-dimensional position.",
              ref: { pdf: 2, page: 420, bookPage: "Ch16" }
            },
            {
              id: "phak_ch16_q8",
              q: "True course (TC) is measured by reference to what?",
              opts: [
                "Magnetic north",
                          "True north",
                          "Compass north",
                          "Grid north"
              ],
              ans: 1,
              exp: "True course is the direction measured by reference to a meridian or true north.",
              ref: { pdf: 2, page: 394, bookPage: "Ch16" }
            },
            {
              id: "phak_ch16_q9",
              q: "Using the formula T = D/GS, how long does it take to fly 210 NM at a groundspeed of 140 knots?",
              opts: [
                "1 hour 15 minutes",
                          "1 hour 30 minutes",
                          "1 hour 45 minutes",
                          "2 hours"
              ],
              ans: 1,
              exp: "210 divided by 140 equals 1.5 hours, which is 1 hour 30 minutes.",
              ref: { pdf: 2, page: 400, bookPage: "Ch16" }
            },
            {
              id: "phak_ch16_q10",
              q: "When tracking to a station using ADF and correcting for wind drift, what is the procedure called that results in a curved flight path?",
              opts: [
                "Tracking",
                          "Homing",
                          "Intercepting",
                          "Orienting"
              ],
              ans: 1,
              exp: "Homing to the station involves keeping the ADF needle on zero, which results in a curved flight path if a crosswind exists.",
              ref: { pdf: 2, page: 419, bookPage: "Ch16" }
            }
        ]
      }
    ]
  },
  phak_ch17: {
    title: "PHAK Ch17: Aeromedical Factors",
    sections: [
      {
        title: "Chapter 17 Key Concepts",
        sectionRef: "PHAK Ch17",
        questions: [
            {
              id: "phak_ch17_q1",
              q: "How long is a third-class medical certificate valid for a pilot under the age of 40?",
              opts: [
                "2 years",
                          "3 years",
                          "5 years",
                          "1 year"
              ],
              ans: 2,
              exp: "A third-class medical certificate is valid for 5 years for those who have not reached the age of 40.",
              ref: { pdf: 2, page: 427, bookPage: "Ch17" }
            },
            {
              id: "phak_ch17_q2",
              q: "Which type of hypoxia results from insufficient oxygen available to the body as a whole, such as at high altitude?",
              opts: [
                "Hypemic hypoxia",
                          "Stagnant hypoxia",
                          "Histotoxic hypoxia",
                          "Hypoxic hypoxia"
              ],
              ans: 3,
              exp: "Hypoxic hypoxia is a result of insufficient oxygen available to the body as a whole, such as from the reduction in partial pressure of oxygen at high altitude.",
              ref: { pdf: 2, page: 428, bookPage: "Ch17" }
            },
            {
              id: "phak_ch17_q3",
              q: "What is the recommended treatment for hyperventilation?",
              opts: [
                "Increase breathing rate",
                          "Breathe normally or breathe into a paper bag",
                          "Hold your breath",
                          "Take deep rapid breaths"
              ],
              ans: 1,
              exp: "Breathing normally is the best prevention and cure for hyperventilation. Breathing into a paper bag or talking aloud also helps.",
              ref: { pdf: 2, page: 430, bookPage: "Ch17" }
            },
            {
              id: "phak_ch17_q4",
              q: "How much more easily does carbon monoxide attach to hemoglobin compared to oxygen?",
              opts: [
                "50 times more easily",
                          "100 times more easily",
                          "200 times more easily",
                          "500 times more easily"
              ],
              ans: 2,
              exp: "Carbon monoxide attaches itself to hemoglobin about 200 times more easily than oxygen.",
              ref: { pdf: 2, page: 437, bookPage: "Ch17" }
            },
            {
              id: "phak_ch17_q5",
              q: "What are the three integrated systems that work together to provide spatial orientation?",
              opts: [
                "Visual, auditory, and tactile",
                          "Vestibular, somatosensory, and visual",
                          "Vestibular, auditory, and olfactory",
                          "Somatosensory, auditory, and visual"
              ],
              ans: 1,
              exp: "The body uses the vestibular system, somatosensory system, and visual system to ascertain orientation and movement.",
              ref: { pdf: 2, page: 431, bookPage: "Ch17" }
            },
            {
              id: "phak_ch17_q6",
              q: "What is the name of the most common illusion during flight, caused by a sudden return to level flight following a gradual turn?",
              opts: [
                "Coriolis illusion",
                          "Graveyard spiral",
                          "The leans",
                          "Somatogravic illusion"
              ],
              ans: 2,
              exp: "The leans is the most common illusion during flight, caused by a sudden return to level flight following a gradual and prolonged turn.",
              ref: { pdf: 2, page: 432, bookPage: "Ch17" }
            },
            {
              id: "phak_ch17_q7",
              q: "What landing error is associated with a narrower-than-usual runway?",
              opts: [
                "A higher approach",
                          "A lower approach",
                          "Landing long",
                          "Landing off-center"
              ],
              ans: 1,
              exp: "A narrower-than-usual runway creates an illusion that the aircraft is higher than it actually is, causing the pilot to fly a lower approach.",
              ref: { pdf: 2, page: 435, bookPage: "Ch17" }
            },
            {
              id: "phak_ch17_q8",
              q: "According to 14 CFR part 91, what is the minimum time that must pass between drinking alcohol and piloting an aircraft?",
              opts: [
                "4 hours",
                          "6 hours",
                          "8 hours",
                          "12 hours"
              ],
              ans: 2,
              exp: "14 CFR part 91 requires that 8 hours pass between drinking alcohol and piloting an aircraft and that blood alcohol level be less than 0.04 percent.",
              ref: { pdf: 2, page: 440, bookPage: "Ch17" }
            },
            {
              id: "phak_ch17_q9",
              q: "What is the time of useful consciousness at 25,000 feet MSL?",
              opts: [
                "1 to 2 minutes",
                          "2 to 3 minutes",
                          "3 to 5 minutes",
                          "5 to 10 minutes"
              ],
              ans: 2,
              exp: "At 25,000 feet MSL, the time of useful consciousness is 3 to 5 minutes.",
              ref: { pdf: 2, page: 429, bookPage: "Ch17" }
            },
            {
              id: "phak_ch17_q10",
              q: "What is the recommended minimum waiting time before flying at altitudes up to 8,000 feet after scuba diving that did not require decompression stops?",
              opts: [
                "4 hours",
                          "8 hours",
                          "12 hours",
                          "24 hours"
              ],
              ans: 2,
              exp: "The recommended waiting time before flying at altitudes up to 8,000 feet is at least 12 hours after diving that does not require controlled ascent (nondecompression stop diving).",
              ref: { pdf: 2, page: 444, bookPage: "Ch17" }
            }
        ]
      }
    ]
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = PHAK_QUESTIONS;
}
