import { prisma } from './utils/prisma.js';

const today = new Date();

async function comprehensiveTest() {
    console.log("🧪 COMPREHENSIVE TEST: 8 kids across 2 wards, multiple vaccines");

    // Clean slate - CORRECT ORDER based on your schema
    await prisma.weightRecord.deleteMany();
    await prisma.vaccinationRecord.deleteMany();
    await prisma.childDueVaccine.deleteMany();
    await prisma.tdDose.deleteMany();
    await prisma.mother.deleteMany();
    await prisma.child.deleteMany();
    await prisma.childAnalyticsFact.deleteMany();
    await prisma.motherAnalyticsFact.deleteMany();
    await prisma.growthAnalyticsFact.deleteMany();
    await prisma.analyticsMeta.deleteMany();

    const admin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });

    // Create 8 children across 2 wards with different ages
    const children = await prisma.child.createManyAndReturn({
        data: [
            // Ward 1 - Mixed scenarios
            { fullName: 'W1_Full_Vax', wardNumber: 1, gender: 'MALE', birthDate: new Date(2023, 6, 1), casteCode: 1, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000001', email: 'w1f@test.com', tole: 'Tole 1', isFromOtherMunicipality: false },
            { fullName: 'W1_Partial_Vax', wardNumber: 1, gender: 'FEMALE', birthDate: new Date(2023, 8, 1), casteCode: 2, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000002', email: 'w1p@test.com', tole: 'Tole 1', isFromOtherMunicipality: false },
            { fullName: 'W1_Zero_Dose', wardNumber: 1, gender: 'MALE', birthDate: new Date(2024, 0, 1), casteCode: 3, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000003', email: 'w1z@test.com', tole: 'Tole 1', isFromOtherMunicipality: false },
            { fullName: 'W1_Overdue', wardNumber: 1, gender: 'FEMALE', birthDate: new Date(2023, 3, 1), casteCode: 1, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000004', email: 'w1o@test.com', tole: 'Tole 1', isFromOtherMunicipality: false },

            // Ward 2 - All vaccinated scenarios  
            { fullName: 'W2_Full_Vax1', wardNumber: 2, gender: 'MALE', birthDate: new Date(2023, 5, 1), casteCode: 2, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000005', email: 'w2f1@test.com', tole: 'Tole 2', isFromOtherMunicipality: false },
            { fullName: 'W2_Full_Vax2', wardNumber: 2, gender: 'FEMALE', birthDate: new Date(2023, 7, 1), casteCode: 3, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000006', email: 'w2f2@test.com', tole: 'Tole 2', isFromOtherMunicipality: false },
            { fullName: 'W2_Partial_Vax', wardNumber: 2, gender: 'MALE', birthDate: new Date(2024, 1, 1), casteCode: 1, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000007', email: 'w2p@test.com', tole: 'Tole 2', isFromOtherMunicipality: false },
            { fullName: 'W2_Zero_Dose', wardNumber: 2, gender: 'FEMALE', birthDate: new Date(2024, 2, 1), casteCode: 2, createdById: admin.id, parentName: 'Parent', phoneNumber: '9800000008', email: 'w2z@test.com', tole: 'Tole 2', isFromOtherMunicipality: false },
        ],
    });

    // Test vaccines: BCG (single), DPT (multi-dose), OPV (multi-dose)
    const testVaccines = [
        { id: 6, name: 'BCG', doses: [1] },           // Single dose
        { id: 7, name: 'DPT_HepB_hib', doses: [1, 2, 3] }, // Multi-dose primary
        { id: 8, name: 'OPV', doses: [1, 2, 3] },    // Multi-dose primary
    ];

    const dues = [];
    const vaccs = [];

    // Define vaccination patterns for each child
    const childVaccinationPatterns = {
        // Ward 1
        'W1_Full_Vax': {
            BCG: [1],
            DPT_HepB_hib: [1, 2, 3],
            OPV: [1, 2, 3]
        },
        'W1_Partial_Vax': {
            BCG: [1],
            DPT_HepB_hib: [1],      // Only dose 1
            OPV: [1, 2]             // Missing dose 3
        },
        'W1_Zero_Dose': {
            // No vaccines
        },
        'W1_Overdue': {
            BCG: [1],
            DPT_HepB_hib: [1],      // Only dose 1 (overdue on 2,3)
            OPV: [1]                // Only dose 1 (overdue on 2,3)
        },

        // Ward 2  
        'W2_Full_Vax1': {
            BCG: [1],
            DPT_HepB_hib: [1, 2, 3],
            OPV: [1, 2, 3]
        },
        'W2_Full_Vax2': {
            BCG: [1],
            DPT_HepB_hib: [1, 2, 3],
            OPV: [1, 2, 3]
        },
        'W2_Partial_Vax': {
            BCG: [1],
            DPT_HepB_hib: [1, 2],   // Missing dose 3
            OPV: [1]                // Missing doses 2,3
        },
        'W2_Zero_Dose': {
            // No vaccines
        }
    };

    // Generate due vaccines and vaccination records
    for (const child of children) {
        const pattern = childVaccinationPatterns[child.fullName];

        for (const vaccine of testVaccines) {
            for (const doseNumber of vaccine.doses) {
                const hasVaccine = pattern[vaccine.name]?.includes(doseNumber) || false;

                // Create due vaccine entry
                dues.push({
                    childId: child.id,
                    vaccineTypeId: vaccine.id,
                    doseNumber: doseNumber,
                    dueDate: today,
                    isCompleted: hasVaccine,
                    scheduleVersion: 1,
                });

                // Create vaccination record if administered
                if (hasVaccine) {
                    vaccs.push({
                        citizenId: child.id,
                        vaccineTypeId: vaccine.id,
                        doseNumber: doseNumber,
                        dateGiven: today,
                        isComplete: true,
                        type: "routine",
                        createdById: admin.id,
                        administeredById: admin.id,
                        wardOfVaccination: child.wardNumber,
                    });
                }
            }
        }
    }

    await prisma.childDueVaccine.createMany({ data: dues });
    await prisma.vaccinationRecord.createMany({ data: vaccs });

    console.log("✅ SEEDED 8 CHILDREN ACROSS 2 WARDS");
    console.log("📊 EXPECTED ANALYTICS RESULTS:");
    console.log("");
    console.log("WARD 1 (4 children):");
    console.log("- Total: 4");
    console.log("- Vaccinated (any): 3");
    console.log("- Zero-dose: 1");
    console.log("- Overdue: 2 (W1_Partial_Vax, W1_Overdue)");
    console.log("");
    console.log("WARD 2 (4 children):");
    console.log("- Total: 4");
    console.log("- Vaccinated (any): 3");
    console.log("- Zero-dose: 1");
    console.log("- Overdue: 1 (W2_Partial_Vax)");
    console.log("");
    console.log("VACCINE COVERAGE:");
    console.log("- BCG: 6/8 = 75%");
    console.log("- DPT_HepB_hib: 4/8 = 50% (all 3 doses)");
    console.log("- OPV: 3/8 = 37.5% (all 3 doses)");
    console.log("");
    console.log("DROPOUT RATES:");
    console.log("- DPT_HepB_hib: Should show realistic dropout from dose1→dose3");
    console.log("- OPV: Should show realistic dropout from dose1→dose3");
    console.log("");
    console.log("🚀 Now run your analyticsFactUpdater.js and verify these numbers!");
}

comprehensiveTest()
    .catch(console.error)
    .finally(() => prisma.$disconnect());