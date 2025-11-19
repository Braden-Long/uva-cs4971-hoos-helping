import { PrismaClient } from "../app/generated/prisma/index.js";
import { purgeDemoData, DEMO_EMAIL_DOMAIN } from "./demo-data-utils.mjs";

const prisma = new PrismaClient();

const taskerSeeds = [
  {
    key: "tasker_avery",
    data: {
      name: "Avery Chen",
      email: `avery.chen@${DEMO_EMAIL_DOMAIN}`,
      bio: "Fourth-year Comm student juggling consulting recruiting and capstone studio projects.",
      skills: [],
    },
  },
  {
    key: "tasker_priya",
    data: {
      name: "Priya Patel",
      email: `priya.patel@${DEMO_EMAIL_DOMAIN}`,
      bio: "MBA candidate focused on venture capital interviews—outsources errands to stay organized.",
      skills: [],
    },
  },
  {
    key: "tasker_marcus",
    data: {
      name: "Marcus Allen",
      email: `marcus.allen@${DEMO_EMAIL_DOMAIN}`,
      bio: "Resident advisor who posts yard work and event prep tasks for his community.",
      skills: [],
    },
  },
  {
    key: "tasker_liam",
    data: {
      name: "Liam Brooks",
      email: `liam.brooks@${DEMO_EMAIL_DOMAIN}`,
      bio: "Computer science TA who constantly sets up demo equipment for hackathons.",
      skills: [],
    },
  },
  {
    key: "tasker_sofia",
    data: {
      name: "Sofia Reyes",
      email: `sofia.reyes@${DEMO_EMAIL_DOMAIN}`,
      bio: "Nursing student on clinical rotations who needs flexible help during night shifts.",
      skills: [],
    },
  },
  {
    key: "tasker_ethan",
    data: {
      name: "Ethan Ward",
      email: `ethan.ward@${DEMO_EMAIL_DOMAIN}`,
      bio: "Student filmmaker always sourcing props and signage for shoots.",
      skills: [],
    },
  },
  {
    key: "tasker_maya",
    data: {
      name: "Maya Johnson",
      email: `maya.johnson@${DEMO_EMAIL_DOMAIN}`,
      bio: "Architecture student coordinating studio crit events and supply runs.",
      skills: [],
    },
  },
  {
    key: "tasker_oliver",
    data: {
      name: "Oliver Wright",
      email: `oliver.wright@${DEMO_EMAIL_DOMAIN}`,
      bio: "Economics student leading a consulting club—hosts frequent workshops.",
      skills: [],
    },
  },
  {
    key: "tasker_harper",
    data: {
      name: "Harper Lin",
      email: `harper.lin@${DEMO_EMAIL_DOMAIN}`,
      bio: "Biology PhD candidate traveling for conferences and needing plant care help.",
      skills: [],
    },
  },
  {
    key: "tasker_declan",
    data: {
      name: "Declan Murphy",
      email: `declan.murphy@${DEMO_EMAIL_DOMAIN}`,
      bio: "Drama department costumer managing rentals and alterations.",
      skills: [],
    },
  },
  {
    key: "tasker_isla",
    data: {
      name: "Isla Bennett",
      email: `isla.bennett@${DEMO_EMAIL_DOMAIN}`,
      bio: "Music education student coordinating choir rehearsals.",
      skills: [],
    },
  },
  {
    key: "tasker_nolan",
    data: {
      name: "Nolan Hughes",
      email: `nolan.hughes@${DEMO_EMAIL_DOMAIN}`,
      bio: "Engineering student with a lab of shared printers and robotics gear.",
      skills: [],
    },
  },
  {
    key: "tasker_serena",
    data: {
      name: "Serena Park",
      email: `serena.park@${DEMO_EMAIL_DOMAIN}`,
      bio: "Sustainability fellow who organizes green events across Grounds.",
      skills: [],
    },
  },
  {
    key: "tasker_felix",
    data: {
      name: "Felix Romero",
      email: `felix.romero@${DEMO_EMAIL_DOMAIN}`,
      bio: "Graduate math tutor balancing thesis deadlines and mentoring.",
      skills: [],
    },
  },
  {
    key: "tasker_lila",
    data: {
      name: "Lila Sanders",
      email: `lila.sanders@${DEMO_EMAIL_DOMAIN}`,
      bio: "Student government communications chair constantly printing collateral.",
      skills: [],
    },
  },
  {
    key: "tasker_rowan",
    data: {
      name: "Rowan Patel",
      email: `rowan.patel@${DEMO_EMAIL_DOMAIN}`,
      bio: "Residence life operations lead who manages storage closets.",
      skills: [],
    },
  },
  {
    key: "tasker_gianna",
    data: {
      name: "Gianna Blake",
      email: `gianna.blake@${DEMO_EMAIL_DOMAIN}`,
      bio: "Media studies senior producing video features for Athletics.",
      skills: [],
    },
  },
  {
    key: "tasker_carter",
    data: {
      name: "Carter Shaw",
      email: `carter.shaw@${DEMO_EMAIL_DOMAIN}`,
      bio: "Orientation leader planning massive welcome events.",
      skills: [],
    },
  },
  {
    key: "tasker_naomi",
    data: {
      name: "Naomi Flores",
      email: `naomi.flores@${DEMO_EMAIL_DOMAIN}`,
      bio: "Global studies student supporting Spanish-speaking families in Charlottesville.",
      skills: [],
    },
  },
  {
    key: "tasker_theo",
    data: {
      name: "Theo Barrett",
      email: `theo.barrett@${DEMO_EMAIL_DOMAIN}`,
      bio: "Career services peer coach reviewing dozens of resumes per week.",
      skills: [],
    },
  },
];

const helperSeeds = [
  {
    key: "helper_jordan",
    data: {
      name: "Jordan Ellis",
      email: `jordan.ellis@${DEMO_EMAIL_DOMAIN}`,
      bio: "Club athlete with a pickup truck—great for moves across Grounds.",
      skills: ["Moving", "Furniture Assembly", "Yard Work"],
      hasCar: true,
      hourlyRate: 32,
      isHelperProfileComplete: true,
      totalTasksAsHelper: 18,
      averageRating: 4.9,
    },
  },
  {
    key: "helper_camila",
    data: {
      name: "Camila Ortiz",
      email: `camila.ortiz@${DEMO_EMAIL_DOMAIN}`,
      bio: "Design student who loves assembling furniture and setting up study spaces.",
      skills: ["Assembly", "Interior Setup", "Tutoring"],
      hasCar: false,
      hourlyRate: 28,
      isHelperProfileComplete: true,
      totalTasksAsHelper: 14,
      averageRating: 4.8,
    },
  },
  {
    key: "helper_noah",
    data: {
      name: "Noah Grant",
      email: `noah.grant@${DEMO_EMAIL_DOMAIN}`,
      bio: "Pre-vet student who specializes in pet care and errand running.",
      skills: ["Pet Care", "Errands", "Delivery"],
      hasCar: true,
      hourlyRate: 24,
      isHelperProfileComplete: true,
      totalTasksAsHelper: 21,
      averageRating: 4.95,
    },
  },
  {
    key: "helper_samira",
    data: {
      name: "Samira Khan",
      email: `samira.khan@${DEMO_EMAIL_DOMAIN}`,
      bio: "MBA student with operations background—loves planning events and executive support.",
      skills: ["Event Support", "Admin", "Errands"],
      hasCar: false,
      hourlyRate: 26,
      isHelperProfileComplete: true,
      totalTasksAsHelper: 11,
      averageRating: 4.7,
    },
  },
  {
    key: "helper_elena",
    data: {
      name: "Elena Rossi",
      email: `elena.rossi@${DEMO_EMAIL_DOMAIN}`,
      bio: "Grad student in environmental engineering who enjoys yard work and DIY repairs.",
      skills: ["Yard Work", "Handyman", "Assembly"],
      hasCar: true,
      hourlyRate: 29,
      isHelperProfileComplete: true,
      totalTasksAsHelper: 9,
      averageRating: 4.85,
    },
  },
  {
    key: "helper_wes",
    data: {
      name: "Wesley Kim",
      email: `wesley.kim@${DEMO_EMAIL_DOMAIN}`,
      bio: "IT support assistant who helps students troubleshoot tech issues on short notice.",
      skills: ["Tech Support", "AV Setup", "Tutoring"],
      hasCar: false,
      hourlyRate: 27,
      isHelperProfileComplete: true,
      totalTasksAsHelper: 16,
      averageRating: 4.92,
    },
  },
];

const baseTaskSeeds = [
  {
    key: "move-couch",
    createdBy: "tasker_avery",
    assignedTo: "helper_jordan",
    data: {
      title: "Move sectional across Grounds",
      description:
        "Need help moving a sectional sofa from Lambeth to an apartment near the Corner. Two flights of stairs at pickup.",
      category: "Moving",
      location: "Charlottesville, VA",
      budget: 140,
      status: "in_progress",
      scheduledDate: new Date("2025-02-18T15:30:00Z"),
      categorySpecificData: {
        hasElevator: false,
        flightsOfStairs: 2,
        requiresTruck: true,
      },
    },
  },
  {
    key: "assemble-wardrobe",
    createdBy: "tasker_priya",
    assignedTo: "helper_camila",
    data: {
      title: "Assemble IKEA Pax wardrobe",
      description:
        "Brand new wardrobe that needs careful assembly before roommates arrive. Instructions included.",
      category: "Assembly",
      location: "Ivy Gardens, Charlottesville",
      budget: 110,
      status: "completed",
      scheduledDate: new Date("2025-01-28T18:00:00Z"),
      completedAt: new Date("2025-01-28T22:00:00Z"),
      categorySpecificData: {
        pieces: 2,
        requiresPowerTools: false,
      },
    },
  },
  {
    key: "yard-cleanup",
    createdBy: "tasker_marcus",
    assignedTo: null,
    data: {
      title: "Yard clean-up before alumni dinner",
      description:
        "Need leaves bagged, patio swept, and string lights tested before Saturday alumni dinner.",
      category: "Yard Work",
      location: "Woodrow apartments",
      budget: 95,
      status: "open",
      scheduledDate: new Date("2025-02-22T14:00:00Z"),
      categorySpecificData: {
        includesLadderWork: true,
        suppliesProvided: true,
      },
    },
  },
  {
    key: "dog-walking",
    createdBy: "tasker_avery",
    assignedTo: "helper_noah",
    data: {
      title: "Walk Wahoo (energetic lab)",
      description:
        "30-minute walk around Scott Stadium area while I'm in lab. Wahoo is leash trained but strong.",
      category: "Pet Care",
      location: "Scott Stadium",
      budget: 35,
      status: "completed",
      scheduledDate: new Date("2025-02-05T20:00:00Z"),
      completedAt: new Date("2025-02-05T20:45:00Z"),
      categorySpecificData: {
        petType: "Dog",
        durationMinutes: 30,
      },
    },
  },
  {
    key: "grocery-pickup",
    createdBy: "tasker_priya",
    assignedTo: null,
    data: {
      title: "Costco grocery pickup before snow",
      description:
        "Need someone with a car to pick up a short Costco run (list provided) and deliver to Brandon Ave.",
      category: "Errands",
      location: "Costco then Brandon Ave",
      budget: 60,
      status: "open",
      scheduledDate: new Date("2025-02-16T17:30:00Z"),
      categorySpecificData: {
        requiresCar: true,
        reimbursesMileage: true,
      },
    },
  },
  {
    key: "tech-setup",
    createdBy: "tasker_liam",
    assignedTo: "helper_wes",
    data: {
      title: "Hackathon AV setup",
      description:
        "Need help running ethernet drops, checking projectors, and labeling HDMI inputs before hackathon kickoff.",
      category: "Tech Support",
      location: "Rice Hall Makerspace",
      budget: 150,
      status: "completed",
      scheduledDate: new Date("2025-01-30T13:00:00Z"),
      completedAt: new Date("2025-01-30T17:00:00Z"),
      categorySpecificData: {
        stations: 6,
        requiresAccessCard: true,
      },
    },
  },
  {
    key: "exam-proctor",
    createdBy: "tasker_sofia",
    assignedTo: "helper_samira",
    data: {
      title: "Evening exam proctor",
      description:
        "Need someone to check-in students and monitor a make-up pharmacology exam for 90 minutes.",
      category: "Admin",
      location: "McLeod Hall",
      budget: 70,
      status: "in_progress",
      scheduledDate: new Date("2025-02-19T00:30:00Z"),
      categorySpecificData: {
        durationMinutes: 90,
        requiresQuiet: true,
      },
    },
  },
  {
    key: "poster-install",
    createdBy: "tasker_ethan",
    assignedTo: "helper_camila",
    data: {
      title: "Install film festival posters",
      description:
        "Mount 8 foam-core posters in Nau Hall hallway with removable adhesive before festival launch.",
      category: "Assembly",
      location: "Nau Hall",
      budget: 85,
      status: "assigned",
      scheduledDate: new Date("2025-02-21T15:00:00Z"),
      categorySpecificData: {
        posters: 8,
        hardwareProvided: true,
      },
    },
  },
  {
    key: "uhaul-return",
    createdBy: "tasker_maya",
    assignedTo: "helper_jordan",
    data: {
      title: "Return U-Haul downtown",
      description:
        "Need licensed driver to return a packed U-Haul van to the downtown lot and grab receipt.",
      category: "Errands",
      location: "Corner to Downtown U-Haul",
      budget: 80,
      status: "completed",
      scheduledDate: new Date("2025-02-02T16:00:00Z"),
      completedAt: new Date("2025-02-02T17:10:00Z"),
      categorySpecificData: {
        requiresLicense: true,
        includesFuelTopOff: true,
      },
    },
  },
  {
    key: "study-snacks",
    createdBy: "tasker_oliver",
    assignedTo: "helper_samira",
    data: {
      title: "Prep snacks for consulting case night",
      description:
        "Pick up snacks from Costco list and set up two tables before our 7pm workshop.",
      category: "Event Support",
      location: "Rouss & Robertson Halls",
      budget: 120,
      status: "assigned",
      scheduledDate: new Date("2025-02-25T22:00:00Z"),
      categorySpecificData: {
        attendees: 45,
        reimbursesSupplies: true,
      },
    },
  },
  {
    key: "plant-care",
    createdBy: "tasker_harper",
    assignedTo: "helper_noah",
    data: {
      title: "Water and rotate greenhouse plants",
      description:
        "20+ plants need watering, misting, and rotation while I'm presenting research in DC.",
      category: "Pet Care",
      location: "South Lawn apartments",
      budget: 55,
      status: "completed",
      scheduledDate: new Date("2025-01-27T13:00:00Z"),
      completedAt: new Date("2025-01-27T14:00:00Z"),
      categorySpecificData: {
        visitCount: 1,
        includesKeys: true,
      },
    },
  },
  {
    key: "costume-alterations",
    createdBy: "tasker_declan",
    assignedTo: "helper_camila",
    data: {
      title: "Alter theater costumes",
      description:
        "Need darts added to three jackets and hems shortened on two skirts before tech rehearsal.",
      category: "Creative",
      location: "Drama Building Costume Shop",
      budget: 130,
      status: "in_progress",
      scheduledDate: new Date("2025-02-17T18:00:00Z"),
      categorySpecificData: {
        garments: 5,
        sewingMachinesOnSite: true,
      },
    },
  },
  {
    key: "choir-setup",
    createdBy: "tasker_isla",
    assignedTo: "helper_samira",
    data: {
      title: "Set up choir risers and chairs",
      description:
        "Need strong helper to set 30 chairs, assemble 4 riser platforms, and run extension cords for mics.",
      category: "Event Support",
      location: "Old Cabell Hall",
      budget: 90,
      status: "completed",
      scheduledDate: new Date("2025-01-25T13:30:00Z"),
      completedAt: new Date("2025-01-25T15:00:00Z"),
      categorySpecificData: {
        chairs: 30,
        risers: 4,
      },
    },
  },
  {
    key: "printer-troubleshoot",
    createdBy: "tasker_nolan",
    assignedTo: "helper_wes",
    data: {
      title: "Fix robotics lab printers",
      description:
        "Need firmware update and queue cleanup on two shared printers before lab practical.",
      category: "Tech Support",
      location: "Thornton Hall",
      budget: 95,
      status: "completed",
      scheduledDate: new Date("2025-01-29T20:00:00Z"),
      completedAt: new Date("2025-01-29T21:30:00Z"),
      categorySpecificData: {
        printers: 2,
        requiresAdminAccess: true,
      },
    },
  },
  {
    key: "compost-haul",
    createdBy: "tasker_serena",
    assignedTo: "helper_elena",
    data: {
      title: "Haul compost bins to Morven farm",
      description:
        "Need someone with a hatchback to haul four sealed compost totes to the Morven compost site.",
      category: "Yard Work",
      location: "New Cabell to Morven Farm",
      budget: 105,
      status: "assigned",
      scheduledDate: new Date("2025-02-24T14:30:00Z"),
      categorySpecificData: {
        totes: 4,
        requiresCar: true,
      },
    },
  },
  {
    key: "calc-tutoring",
    createdBy: "tasker_felix",
    assignedTo: "helper_wes",
    data: {
      title: "Calc II tutoring refresh",
      description:
        "Looking for someone to drill integration by parts problems before my recitation.",
      category: "Tutoring",
      location: "Shannon Commons",
      budget: 45,
      status: "completed",
      scheduledDate: new Date("2025-02-03T23:00:00Z"),
      completedAt: new Date("2025-02-04T00:00:00Z"),
      categorySpecificData: {
        durationMinutes: 60,
        topic: "Integration Techniques",
      },
    },
  },
  {
    key: "event-flyering",
    createdBy: "tasker_lila",
    assignedTo: null,
    data: {
      title: "Hang flyers across Grounds",
      description:
        "Need 75 flyers distributed across libraries, dining halls, and parking decks by Thursday.",
      category: "Marketing",
      location: "Grounds-wide",
      budget: 80,
      status: "open",
      scheduledDate: new Date("2025-02-20T15:00:00Z"),
      categorySpecificData: {
        flyers: 75,
        requiresPhotoProof: true,
      },
    },
  },
  {
    key: "storage-organization",
    createdBy: "tasker_rowan",
    assignedTo: "helper_elena",
    data: {
      title: "Organize residence life storage closet",
      description:
        "Sort labeled bins, assemble two shelves, and inventory equipment for resident assistants.",
      category: "Assembly",
      location: "Lambeth Field apartments",
      budget: 115,
      status: "in_progress",
      scheduledDate: new Date("2025-02-10T18:30:00Z"),
      categorySpecificData: {
        shelvesToAssemble: 2,
        binsToLabel: 18,
      },
    },
  },
  {
    key: "drone-footage",
    createdBy: "tasker_gianna",
    assignedTo: "helper_jordan",
    data: {
      title: "Capture drone footage of practice",
      description:
        "Need licensed operator to capture two angles of women's soccer practice for hype video.",
      category: "Creative",
      location: "Klöckner Stadium",
      budget: 160,
      status: "assigned",
      scheduledDate: new Date("2025-02-27T21:00:00Z"),
      categorySpecificData: {
        durationMinutes: 60,
        requiresFAARegistration: true,
      },
    },
  },
  {
    key: "orientation-bags",
    createdBy: "tasker_carter",
    assignedTo: "helper_samira",
    data: {
      title: "Stuff 500 welcome bags",
      description:
        "Assemble tote bags with swag, fold brochures, and stack by residence hall delivery order.",
      category: "Event Support",
      location: "Newcomb Ballroom",
      budget: 200,
      status: "assigned",
      scheduledDate: new Date("2025-03-01T14:00:00Z"),
      categorySpecificData: {
        bagCount: 500,
        volunteersOnSite: 3,
      },
    },
  },
  {
    key: "translation-help",
    createdBy: "tasker_naomi",
    assignedTo: "helper_noah",
    data: {
      title: "Translate welcome letter to Spanish",
      description:
        "Need culturally sensitive translation for a community resource letter (2 pages).",
      category: "Admin",
      location: "Remote",
      budget: 75,
      status: "completed",
      scheduledDate: new Date("2025-02-01T15:00:00Z"),
      completedAt: new Date("2025-02-01T18:00:00Z"),
      categorySpecificData: {
        wordCount: 500,
        requiresProofreading: true,
      },
    },
  },
  {
    key: "resume-review",
    createdBy: "tasker_theo",
    assignedTo: "helper_camila",
    data: {
      title: "Design-forward resume refresh",
      description:
        "Need someone with InDesign chops to refresh my peer coaching resume template.",
      category: "Creative",
      location: "Remote",
      budget: 65,
      status: "in_progress",
      scheduledDate: new Date("2025-02-12T17:00:00Z"),
      categorySpecificData: {
        software: "InDesign",
        roundsOfFeedback: 2,
      },
    },
  },
  {
    key: "bookshelf-build",
    createdBy: "tasker_lila",
    assignedTo: null,
    data: {
      title: "Assemble two Target bookshelves",
      description:
        "Need both shelves assembled and anchored to the wall before roommates return.",
      category: "Assembly",
      location: "West Lawn",
      budget: 95,
      status: "open",
      scheduledDate: new Date("2025-02-23T18:00:00Z"),
      categorySpecificData: {
        shelves: 2,
        anchorToWall: true,
      },
    },
  },
  {
    key: "meal-prep",
    createdBy: "tasker_naomi",
    assignedTo: null,
    data: {
      title: "Meal prep for community potluck",
      description:
        "Chop veggies, prep guacamole, and portion ingredients for 20 servings.",
      category: "Errands",
      location: "10th Street NW",
      budget: 70,
      status: "open",
      scheduledDate: new Date("2025-02-18T21:00:00Z"),
      categorySpecificData: {
        servings: 20,
        kitchenProvided: true,
      },
    },
  },
  {
    key: "bike-tune",
    createdBy: "tasker_theo",
    assignedTo: null,
    data: {
      title: "Bike tune-up before MS Walk",
      description:
        "Brake tightening, tire inflation, and chain lube for my commuter bike.",
      category: "Other",
      location: "Preston Ave",
      budget: 45,
      status: "open",
      scheduledDate: new Date("2025-02-15T15:30:00Z"),
      categorySpecificData: {
        needsReplacementParts: false,
      },
    },
  },
  {
    key: "lab-supplies",
    createdBy: "tasker_serena",
    assignedTo: null,
    data: {
      title: "Pick up lab supplies from surplus",
      description:
        "Need someone with a car to grab boxed beakers and a mini fridge from UVA ReUSE store.",
      category: "Errands",
      location: "Fontaine Research Park",
      budget: 80,
      status: "open",
      scheduledDate: new Date("2025-02-19T18:00:00Z"),
      categorySpecificData: {
        requiresCar: true,
        boxes: 4,
      },
    },
  },
  {
    key: "tailgate-setup",
    createdBy: "tasker_carter",
    assignedTo: null,
    data: {
      title: "Game day tailgate setup",
      description:
        "Unload tents, set up tables, and run extension cords for 50-person tailgate.",
      category: "Event Support",
      location: "Scott Stadium Lower Lot",
      budget: 110,
      status: "open",
      scheduledDate: new Date("2025-02-22T14:30:00Z"),
      categorySpecificData: {
        tents: 3,
        requiresHeavyLifting: true,
      },
    },
  },
  {
    key: "moveout-clean",
    createdBy: "tasker_rowan",
    assignedTo: null,
    data: {
      title: "Residence hall move-out cleaning",
      description:
        "Deep clean a common lounge (wipe surfaces, vacuum, mop kitchenette) before inspection.",
      category: "Cleaning",
      location: "Gooch/Dillard",
      budget: 85,
      status: "open",
      scheduledDate: new Date("2025-02-28T16:00:00Z"),
      categorySpecificData: {
        suppliesProvided: true,
      },
    },
  },
  {
    key: "photo-coverage",
    createdBy: "tasker_gianna",
    assignedTo: null,
    data: {
      title: "Game photography coverage",
      description:
        "Need second shooter for baseball scrimmage; must deliver RAW photos same night.",
      category: "Creative",
      location: "Disharoon Park",
      budget: 150,
      status: "open",
      scheduledDate: new Date("2025-02-26T22:00:00Z"),
      categorySpecificData: {
        durationMinutes: 120,
        deliverable: "RAW files",
      },
    },
  },
  {
    key: "cat-sitting",
    createdBy: "tasker_sofia",
    assignedTo: null,
    data: {
      title: "Cat sitting during night shift",
      description:
        "Check in twice between 8pm-6am to feed Luna, refresh water, and send quick video.",
      category: "Pet Care",
      location: "Cleveland Ave",
      budget: 55,
      status: "open",
      scheduledDate: new Date("2025-02-20T01:00:00Z"),
      categorySpecificData: {
        visits: 2,
        medsRequired: false,
      },
    },
  },
  {
    key: "snow-shovel",
    createdBy: "tasker_marcus",
    assignedTo: null,
    data: {
      title: "Shovel icy front steps",
      description:
        "Clear steps and salt walkway for residents at Brandon Ave apartment.",
      category: "Yard Work",
      location: "Brandon Ave",
      budget: 65,
      status: "open",
      scheduledDate: new Date("2025-02-14T13:00:00Z"),
      categorySpecificData: {
        suppliesProvided: true,
      },
    },
  },
  {
    key: "laptop-backup",
    createdBy: "tasker_liam",
    assignedTo: null,
    data: {
      title: "Backup laptops to external drive",
      description:
        "Archive two laptops before hackathon; includes verifying Time Machine restore.",
      category: "Tech Support",
      location: "Rice Hall",
      budget: 75,
      status: "open",
      scheduledDate: new Date("2025-02-18T16:30:00Z"),
      categorySpecificData: {
        laptops: 2,
        requiresAdminAccess: true,
      },
    },
  },
  {
    key: "spanish-tutoring",
    createdBy: "tasker_felix",
    assignedTo: null,
    data: {
      title: "Spanish conversation partner",
      description:
        "Help me practice intermediate Spanish phrases before I travel abroad.",
      category: "Tutoring",
      location: "Clemons Library",
      budget: 40,
      status: "open",
      scheduledDate: new Date("2025-02-17T00:30:00Z"),
      categorySpecificData: {
        durationMinutes: 60,
        focus: "Conversational",
      },
    },
  },
  {
    key: "graphic-refresh",
    createdBy: "tasker_ethan",
    assignedTo: null,
    data: {
      title: "Graphic refresh for film night",
      description:
        "Need poster + Instagram story template using UVA brand colors.",
      category: "Creative",
      location: "Remote",
      budget: 90,
      status: "open",
      scheduledDate: new Date("2025-02-21T20:00:00Z"),
      categorySpecificData: {
        deliverables: ["Poster", "Story template"],
        fileFormat: "Figma",
      },
    },
  },
  {
    key: "laundry-fold",
    createdBy: "tasker_maya",
    assignedTo: null,
    data: {
      title: "Fold laundry + organize closet",
      description:
        "Two loads of laundry need folding and closet organization before studio review.",
      category: "Cleaning",
      location: "Preston Place",
      budget: 50,
      status: "open",
      scheduledDate: new Date("2025-02-16T18:30:00Z"),
      categorySpecificData: {
        loads: 2,
        hangItems: true,
      },
    },
  },
  {
    key: "coffee-run",
    createdBy: "tasker_avery",
    assignedTo: null,
    data: {
      title: "Early-morning coffee run",
      description:
        "Grab 6 lattes from Grit and deliver to McIntire before 8am team meeting.",
      category: "Errands",
      location: "Grit Coffee to McIntire",
      budget: 35,
      status: "open",
      scheduledDate: new Date("2025-02-13T12:30:00Z"),
      categorySpecificData: {
        drinks: 6,
        reimbursementIncluded: true,
      },
    },
  },
];

const baseApplicationSeeds = [
  {
    task: "yard-cleanup",
    helper: "helper_jordan",
    status: "pending",
    proposedRate: 38,
    message: "Have my own rakes and can bring extra string lights to test.",
  },
  {
    task: "yard-cleanup",
    helper: "helper_noah",
    status: "pending",
    proposedRate: 35,
    message:
      "Can work Friday afternoon or Saturday morning—have landscaping experience.",
  },
  {
    task: "grocery-pickup",
    helper: "helper_noah",
    status: "pending",
    proposedRate: 30,
    message: "Already planning a Costco trip Friday—happy to combine runs.",
  },
  {
    task: "grocery-pickup",
    helper: "helper_jordan",
    status: "pending",
    proposedRate: 32,
    message:
      "Pickup truck with covered bed; can deliver even if weather turns.",
  },
  {
    task: "move-couch",
    helper: "helper_jordan",
    status: "accepted",
    proposedRate: 65,
    message: "Truck + furniture blankets ready. Can bring a friend if needed.",
  },
  {
    task: "assemble-wardrobe",
    helper: "helper_camila",
    status: "accepted",
    proposedRate: 55,
    message: "I’ve built three Pax units—will bring electric screwdriver.",
  },
  {
    task: "dog-walking",
    helper: "helper_noah",
    status: "accepted",
    proposedRate: 25,
    message: "Pre-vet student who walks large dogs daily.",
  },
  {
    task: "tech-setup",
    helper: "helper_wes",
    status: "accepted",
    proposedRate: 75,
    message:
      "Already familiar with Rice Hall AV gear and can label all stations.",
  },
  {
    task: "exam-proctor",
    helper: "helper_samira",
    status: "accepted",
    proposedRate: 40,
    message: "Can arrive 20 minutes early to review instructions.",
  },
  {
    task: "poster-install",
    helper: "helper_camila",
    status: "accepted",
    proposedRate: 50,
    message: "I have a level and removable adhesive ready to go.",
  },
  {
    task: "plant-care",
    helper: "helper_noah",
    status: "accepted",
    proposedRate: 28,
    message:
      "Happy to send photos after watering to confirm everything looks good.",
  },
  {
    task: "choir-setup",
    helper: "helper_samira",
    status: "accepted",
    proposedRate: 55,
    message: "Can recruit one more friend if you need extra hands.",
  },
  {
    task: "printer-troubleshoot",
    helper: "helper_wes",
    status: "accepted",
    proposedRate: 45,
    message:
      "I manage the same model at Clemons—firmware update will be quick.",
  },
  {
    task: "calc-tutoring",
    helper: "helper_wes",
    status: "accepted",
    proposedRate: 30,
    message: "Let’s cover substitution strategies plus a mock quiz.",
  },
  {
    task: "storage-organization",
    helper: "helper_elena",
    status: "accepted",
    proposedRate: 60,
    message: "Can bring my own label maker and drill.",
  },
  {
    task: "drone-footage",
    helper: "helper_jordan",
    status: "pending",
    proposedRate: 85,
    message: "FAA-certified and already has insurance certificate on file.",
  },
  {
    task: "compost-haul",
    helper: "helper_elena",
    status: "accepted",
    proposedRate: 60,
    message: "Have a Subaru hatchback with tarp to keep things tidy.",
  },
  {
    task: "orientation-bags",
    helper: "helper_samira",
    status: "accepted",
    proposedRate: 120,
    message: "Can also train volunteers so assembly line moves quickly.",
  },
  {
    task: "translation-help",
    helper: "helper_noah",
    status: "accepted",
    proposedRate: 40,
    message: "Native speaker—can deliver both Word and PDF versions.",
  },
  {
    task: "resume-review",
    helper: "helper_camila",
    status: "pending",
    proposedRate: 42,
    message: "Can share two layout options by Wednesday night.",
  },
];

const reviewSeeds = [
  {
    task: "assemble-wardrobe",
    reviewer: "tasker_priya",
    reviewee: "helper_camila",
    rating: 5,
    comment:
      "Camila worked fast and kept everything organized. Wardrobe looks perfect.",
  },
  {
    task: "assemble-wardrobe",
    reviewer: "helper_camila",
    reviewee: "tasker_priya",
    rating: 5,
    comment:
      "Priya prepped the space and instructions ahead of time—a joy to work with.",
  },
  {
    task: "dog-walking",
    reviewer: "tasker_avery",
    reviewee: "helper_noah",
    rating: 5,
    comment:
      "Noah handled Wahoo like a pro. Sent pics and a quick summary after the walk.",
  },
  {
    task: "dog-walking",
    reviewer: "helper_noah",
    reviewee: "tasker_avery",
    rating: 5,
    comment: "Clear instructions and flexible timing. Happy to help anytime.",
  },
  {
    task: "plant-care",
    reviewer: "tasker_harper",
    reviewee: "helper_noah",
    rating: 5,
    comment: "Came right on time and left detailed care notes for each plant.",
  },
  {
    task: "plant-care",
    reviewer: "helper_noah",
    reviewee: "tasker_harper",
    rating: 5,
    comment: "Loved the spreadsheet of plant instructions—super easy gig.",
  },
  {
    task: "tech-setup",
    reviewer: "tasker_liam",
    reviewee: "helper_wes",
    rating: 5,
    comment: "Wes labeled every station and saved us an hour on event day.",
  },
  {
    task: "uhaul-return",
    reviewer: "tasker_maya",
    reviewee: "helper_jordan",
    rating: 5,
    comment: "Jordan handled the paperwork and even swept the van.",
  },
  {
    task: "printer-troubleshoot",
    reviewer: "tasker_nolan",
    reviewee: "helper_wes",
    rating: 4,
    comment:
      "Printers work again! Took a bit longer than expected but thorough.",
  },
  {
    task: "calc-tutoring",
    reviewer: "tasker_felix",
    reviewee: "helper_wes",
    rating: 5,
    comment: "Clear explanations that I can use with my own students.",
  },
  {
    task: "translation-help",
    reviewer: "tasker_naomi",
    reviewee: "helper_noah",
    rating: 5,
    comment: "Translation captured the right tone for parents—thank you!",
  },
];

function mapByKey(records) {
  return records.reduce((acc, entry) => {
    acc[entry.key] = entry.record;
    return acc;
  }, {});
}

const sampleLocations = [
  "Charlottesville, VA",
  "North Grounds",
  "Corner District",
  "Belmont",
  "Downtown Mall",
  "Ivy Road",
  "Preston Avenue",
];

const yousifPostedTemplates = [
  {
    title: "Run student org merch pickup",
    description:
      "Need a Costco run for 12 cases of drinks and merch boxes, then deliver to Newcomb Hall for our fundraiser.",
    category: "Errands",
    location: "Costco → Newcomb Hall",
    baseBudget: 85,
    categorySpecificData: { requiresCar: true, reimbursesMileage: true },
  },
  {
    title: "Assemble pop-up event kiosk",
    description:
      "We purchased a collapsible kiosk that needs to be assembled and tested before the housing fair.",
    category: "Assembly",
    location: "1515 University Ave",
    baseBudget: 95,
    categorySpecificData: { requiresPowerTools: false },
  },
  {
    title: "Prep tailgate welcome table",
    description:
      "Set up tent, lights, and swag table for Saturday tailgate. Includes hanging signage and running extension cords.",
    category: "Event Support",
    location: "Scott Stadium lower lot",
    baseBudget: 110,
    categorySpecificData: { requiresCar: false, includesLifting: true },
  },
  {
    title: "Host apartment move-out cleaning",
    description:
      "Post-studio deep clean for 2BR apartment (vacuum, mop, wipe surfaces, clean balcony). Supplies provided.",
    category: "Cleaning",
    location: "Preston Ave apartments",
    baseBudget: 100,
    categorySpecificData: { propertyType: "apartment" },
  },
  {
    title: "Yard tidy before committee visit",
    description:
      "We need leaves bagged, planters watered, and string lights rehung before Monday evening visit.",
    category: "Yard Work",
    location: "University Circle",
    baseBudget: 90,
    categorySpecificData: { includesLadderWork: true },
  },
  {
    title: "Large format print drop",
    description:
      "Pick up five 24x36 prints from Cavalier Copy and deliver to Darden conference room before noon.",
    category: "Errands",
    location: "Cavalier Copy → Darden",
    baseBudget: 70,
    categorySpecificData: { fragile: true },
  },
  {
    title: "Tech check for startup pitch",
    description:
      "Need help testing HDMI/Zoom setup and staging demo laptop for Tuesday pitch night.",
    category: "Tech Support",
    location: "Batton School",
    baseBudget: 95,
    categorySpecificData: { requiresAdminAccess: false },
  },
  {
    title: "Assemble IKEA Alex drawer trio",
    description:
      "Three Alex drawer units need assembly for our design studio. Instructions and tools on site.",
    category: "Assembly",
    location: "A-School studio",
    baseBudget: 120,
    categorySpecificData: { items: 3 },
  },
];

const yousifHelperTemplates = [
  {
    title: "Volunteer check-in booth",
    description:
      "Manage volunteer check-in and swag distribution for Alumni Weekend for 2 hours.",
    category: "Event Support",
    location: "Alumni Hall",
    baseBudget: 70,
    categorySpecificData: { includesBriefing: true },
  },
  {
    title: "Dog walk for grad student lab hours",
    description:
      "Take energetic lab mix for 40-minute walk around Observatory Hill while owner is in lab.",
    category: "Pet Care",
    location: "Observatory Hill",
    baseBudget: 45,
    categorySpecificData: { petType: "Dog" },
  },
  {
    title: "Help break down film night",
    description:
      "Need an extra set of hands to coil cables, pack speakers, and fold chairs after screening.",
    category: "Event Support",
    location: "Culbreth Theatre",
    baseBudget: 80,
    categorySpecificData: { liftRequirement: true },
  },
  {
    title: "Printer queue troubleshooting",
    description:
      "Reset firmware on two makerspace printers and create a quick troubleshooting guide for peer staff.",
    category: "Tech Support",
    location: "Rice Makerspace",
    baseBudget: 95,
    categorySpecificData: { printers: 2 },
  },
  {
    title: "Grocery run for student parent",
    description:
      "Weekly Wegmans pickup and drop-off for family on JPA. Bring items up one flight of stairs.",
    category: "Errands",
    location: "Wegmans → JPA",
    baseBudget: 75,
    categorySpecificData: { requiresCar: true },
  },
  {
    title: "Folding and labeling club merch",
    description:
      "Fold, bag, and label 200 shirts by size for club distribution event.",
    category: "Event Support",
    location: "Newcomb Ballroom",
    baseBudget: 100,
    categorySpecificData: { bagCount: 200 },
  },
  {
    title: "STEM tutoring crash session",
    description:
      "Need Calc III refresher for 90 minutes before quiz (integration techniques).",
    category: "Tutoring",
    location: "Alderman Library",
    baseBudget: 60,
    categorySpecificData: { topic: "Calculus" },
  },
  {
    title: "Move-in furniture assembly assist",
    description:
      "Assemble two standing desks and mount whiteboard shelves for incoming resident.",
    category: "Assembly",
    location: "Lambeth",
    baseBudget: 110,
    categorySpecificData: { items: 2 },
  },
];

const yousifApplicationTemplates = [
  {
    title: "Pop-up shop cash wrap setup",
    description:
      "Need a helper to build Square cash wrap, hang signage, and stash boxes.",
    category: "Assembly",
    location: "Downtown Mall",
    baseBudget: 85,
    message:
      "I set up several pop-up shops for student orgs—happy to build the cash wrap and cable-manage the Square gear.",
  },
  {
    title: "Bike valet for rugby fundraiser",
    description: "Monitor and tag bikes during fundraiser on Saturday morning.",
    category: "Event Support",
    location: "Carr's Hill",
    baseBudget: 65,
    message:
      "I can handle the valet tags/log and bring clipboards. Let me know if you need cones set up as well.",
  },
  {
    title: "Package assembly for HOOS Pantry",
    description: "Assemble 150 meal kits and label with dietary notes.",
    category: "Event Support",
    location: "Newcomb",
    baseBudget: 90,
    message:
      "I've helped HOOS Pantry before—comfortable with labeling and keeping allergens organized.",
  },
  {
    title: "Move-out dump run",
    description: "Need someone with SUV to haul boxes to recycling center.",
    category: "Errands",
    location: "JPA → Ivy Materials Recovery",
    baseBudget: 80,
    message:
      "I have a hatchback and can take two trips if needed. Happy to send dump receipts afterward.",
  },
  {
    title: "Pet sitting for two cats",
    description: "Check on two cats twice daily for four days.",
    category: "Pet Care",
    location: "Belmont",
    baseBudget: 120,
    message:
      "Comfortable with twice-daily visits and can text photos after each feeding.",
  },
];

const yousifUserSeed = {
  key: "user_yousif",
  data: {
    name: "Yousif Abood",
    email: "yousif@hooshelping.com",
    bio: "Product-minded tasker who also helps with event logistics and tech setups.",
    role: "user",
    skills: ["Event Support", "Tech Support", "Errands"],
    hasCar: true,
    hourlyRate: 32,
    isHelperProfileComplete: true,
    totalTasksAsHelper: 42,
    averageRating: 4.85,
  },
};

const postedStatuses = [
  ...Array(12).fill("open"),
  ...Array(6).fill("in_progress"),
  ...Array(6).fill("completed"),
];

const formatZonedDate = (month, day, hour) =>
  new Date(
    `2025-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}T${hour.toString().padStart(2, "0")}:00:00Z`
  );

const yousifPostedTasks = Array.from({ length: 24 }, (_, index) => {
  const status = postedStatuses[index % postedStatuses.length];
  const template = yousifPostedTemplates[index % yousifPostedTemplates.length];
  const helperKey =
    status === "open"
      ? null
      : (helperSeeds[index % helperSeeds.length]?.key ?? null);

  return {
    key: `yousif-posted-${index + 1}`,
    createdBy: yousifUserSeed.key,
    assignedTo: helperKey,
    data: {
      title: template.title,
      description: template.description,
      category: template.category,
      location:
        template.location || sampleLocations[index % sampleLocations.length],
      budget: template.baseBudget + (index % 3) * 5,
      status,
      scheduledDate: formatZonedDate(3, (index % 9) + 1, 15),
      categorySpecificData: template.categorySpecificData || null,
    },
  };
});

const yousifAssignedTaskSeeds = Array.from({ length: 22 }, (_, index) => {
  const creatorKeys = [
    "tasker_avery",
    "tasker_priya",
    "tasker_marcus",
    "tasker_liam",
    "tasker_sofia",
  ];
  const status =
    index < 10 ? "assigned" : index < 16 ? "in_progress" : "completed";
  const creator = creatorKeys[index % creatorKeys.length];
  const template = yousifHelperTemplates[index % yousifHelperTemplates.length];
  return {
    key: `yousif-helper-${index + 1}`,
    createdBy: creator,
    assignedTo: yousifUserSeed.key,
    data: {
      title: template.title,
      description: template.description,
      category: template.category,
      location:
        template.location ||
        sampleLocations[(index + 3) % sampleLocations.length],
      budget: template.baseBudget + (index % 4) * 6,
      status,
      scheduledDate: formatZonedDate(2, (index % 10) + 5, 18),
      categorySpecificData: template.categorySpecificData || null,
    },
  };
});

const applicationTaskCreators = [
  "tasker_serena",
  "tasker_gianna",
  "tasker_carter",
  "tasker_naomi",
  "tasker_theo",
];

const yousifPendingTaskSeeds = Array.from({ length: 23 }, (_, index) => {
  const template =
    yousifApplicationTemplates[index % yousifApplicationTemplates.length];
  return {
    key: `yousif-application-${index + 1}`,
    createdBy: applicationTaskCreators[index % applicationTaskCreators.length],
    assignedTo: null,
    data: {
      title: template.title,
      description: template.description,
      category: template.category,
      location:
        template.location ||
        sampleLocations[(index + 4) % sampleLocations.length],
      budget: template.baseBudget + (index % 3) * 10,
      status: "open",
      scheduledDate: formatZonedDate(3, (index % 6) + 10, 20),
      categorySpecificData: { flexibleTiming: index % 2 === 0 },
    },
  };
});

const taskSeeds = [
  ...baseTaskSeeds,
  ...yousifPostedTasks,
  ...yousifAssignedTaskSeeds,
  ...yousifPendingTaskSeeds,
];

const yousifApplicationSeeds = yousifPendingTaskSeeds.map((task, index) => {
  const template =
    yousifApplicationTemplates[index % yousifApplicationTemplates.length];
  return {
    task: task.key,
    helper: yousifUserSeed.key,
    status: "pending",
    proposedRate: 28 + (index % 5) * 3,
    message: template.message,
  };
});

const applicationSeeds = [...baseApplicationSeeds, ...yousifApplicationSeeds];

async function main() {
  console.log("Clearing existing demo data…");
  await purgeDemoData(prisma);

  console.log("Creating demo tasker accounts…");
  const taskers = [];
  for (const seed of taskerSeeds) {
    const record = await prisma.user.create({ data: seed.data });
    taskers.push({ key: seed.key, record });
  }

  console.log("Creating demo helper accounts…");
  const helpers = [];
  for (const seed of helperSeeds) {
    const record = await prisma.user.create({ data: seed.data });
    helpers.push({ key: seed.key, record });
  }

  console.log("Creating primary demo account…");
  const yousifRecord = await prisma.user.create({ data: yousifUserSeed.data });

  const userMap = { ...mapByKey(taskers), ...mapByKey(helpers) };
  userMap[yousifUserSeed.key] = yousifRecord;

  console.log(`Creating sample tasks (${taskSeeds.length})…`);
  const tasks = [];
  for (const seed of taskSeeds) {
    const createdTask = await prisma.task.create({
      data: {
        ...seed.data,
        createdById: userMap[seed.createdBy].id,
        assignedToId: seed.assignedTo ? userMap[seed.assignedTo].id : null,
      },
    });
    tasks.push({ key: seed.key, record: createdTask });
  }
  const taskMap = mapByKey(tasks);

  console.log("Creating applications…");
  for (const seed of applicationSeeds) {
    await prisma.application.create({
      data: {
        taskId: taskMap[seed.task].id,
        helperId: userMap[seed.helper].id,
        message: seed.message,
        proposedRate: seed.proposedRate,
        status: seed.status,
      },
    });
  }

  console.log("Adding reviews to completed work…");
  for (const seed of reviewSeeds) {
    await prisma.review.create({
      data: {
        taskId: taskMap[seed.task].id,
        reviewerId: userMap[seed.reviewer].id,
        revieweeId: userMap[seed.reviewee].id,
        rating: seed.rating,
        comment: seed.comment,
      },
    });
  }

  console.log("Demo data seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Failed to seed demo data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
