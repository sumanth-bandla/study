import { Subject, DailyTask, RevisionItem, Backlog, Exam } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-bda',
    code: 'CS601PC',
    name: 'Big Data Analytics (BDA)',
    priority: 'High',
    color: '#3b82f6',
    examDate: '2026-11-20',
    units: [
      {
        id: 'u-bda-1',
        unitNumber: 1,
        title: 'Introduction to Big Data & Hadoop Architecture',
        completed: true,
        topics: [
          { id: 't-bda-101', title: 'Characteristics of Big Data (5 Vs)', completed: true, isImportant: true },
          { id: 't-bda-102', title: 'Hadoop Distributed File System (HDFS)', completed: true, isImportant: true },
          { id: 't-bda-103', title: 'HDFS Architecture: NameNode & DataNodes', completed: true, isImportant: true },
          { id: 't-bda-104', title: 'YARN Resource Manager Framework', completed: true }
        ]
      },
      {
        id: 'u-bda-2',
        unitNumber: 2,
        title: 'MapReduce Paradigm & Programming Model',
        completed: true,
        topics: [
          { id: 't-bda-201', title: 'MapReduce Data Flow & Shuffling', completed: true, isImportant: true },
          { id: 't-bda-202', title: 'Combiners and Partitioners', completed: true },
          { id: 't-bda-203', title: 'Word Count Algorithm in MapReduce', completed: true, isImportant: true }
        ]
      },
      {
        id: 'u-bda-3',
        unitNumber: 3,
        title: 'NoSQL Databases & Big Data Storage',
        completed: false,
        topics: [
          { id: 't-bda-301', title: 'CAP Theorem and BASE Properties', completed: false, isImportant: true },
          { id: 't-bda-302', title: 'Key-Value, Document, and Columnar Stores', completed: false },
          { id: 't-bda-303', title: 'Apache HBase Architecture & ZooKeeper', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-bda-4',
        unitNumber: 4,
        title: 'Apache Spark Architecture & RDDs',
        completed: false,
        topics: [
          { id: 't-bda-401', title: 'Spark Ecosystem vs Hadoop MapReduce', completed: false, isImportant: true },
          { id: 't-bda-402', title: 'Resilient Distributed Datasets (RDD) Operations', completed: false, isImportant: true },
          { id: 't-bda-403', title: 'Spark Transformations vs Actions', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-bda-5',
        unitNumber: 5,
        title: 'Stream Processing & Machine Learning with Spark MLlib',
        completed: false,
        topics: [
          { id: 't-bda-501', title: 'Spark Streaming and DStreams', completed: false },
          { id: 't-bda-502', title: 'PageRank Algorithm on GraphX', completed: false, isImportant: true },
          { id: 't-bda-503', title: 'MLlib Pipelines & Recommendation Systems', completed: false }
        ]
      }
    ]
  },
  {
    id: 'sub-hrpm',
    code: 'HS602PE',
    name: 'Human Resource & Project Management (HRPM)',
    priority: 'Medium',
    color: '#10b981',
    examDate: '2026-11-23',
    units: [
      {
        id: 'u-hrpm-1',
        unitNumber: 1,
        title: 'Introduction to Human Resource Management',
        completed: true,
        topics: [
          { id: 't-hrpm-101', title: 'HRM Nature, Scope, and Objectives', completed: true },
          { id: 't-hrpm-102', title: 'Job Analysis, Job Description & Specification', completed: true, isImportant: true }
        ]
      },
      {
        id: 'u-hrpm-2',
        unitNumber: 2,
        title: 'Recruitment, Selection, and Performance Appraisal',
        completed: false,
        topics: [
          { id: 't-hrpm-201', title: 'Recruitment Sources & Selection Process', completed: false, isImportant: true },
          { id: 't-hrpm-202', title: '360-Degree Performance Appraisal', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-hrpm-3',
        unitNumber: 3,
        title: 'Project Initiation and Scope Management',
        completed: false,
        topics: [
          { id: 't-hrpm-301', title: 'Project Life Cycle Phases', completed: false, isImportant: true },
          { id: 't-hrpm-302', title: 'Work Breakdown Structure (WBS)', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-hrpm-4',
        unitNumber: 4,
        title: 'Project Scheduling: CPM and PERT Analysis',
        completed: false,
        topics: [
          { id: 't-hrpm-401', title: 'Critical Path Method (CPM) Calculations', completed: false, isImportant: true },
          { id: 't-hrpm-402', title: 'PERT 3-Time Estimates & Variance', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-hrpm-5',
        unitNumber: 5,
        title: 'Project Risk and Cost Management',
        completed: false,
        topics: [
          { id: 't-hrpm-501', title: 'Earned Value Management (EVM)', completed: false, isImportant: true },
          { id: 't-hrpm-502', title: 'Risk Identification and Mitigation Strategies', completed: false }
        ]
      }
    ]
  },
  {
    id: 'sub-sadp',
    code: 'CS603PC',
    name: 'Software Architecture & Design Patterns (SADP)',
    priority: 'High',
    color: '#8b5cf6',
    examDate: '2026-11-26',
    units: [
      {
        id: 'u-sadp-1',
        unitNumber: 1,
        title: 'Envisioning Architecture & Quality Attributes',
        completed: true,
        topics: [
          { id: 't-sadp-101', title: 'What is Software Architecture?', completed: true },
          { id: 't-sadp-102', title: 'Architectural Business Cycle (ABC)', completed: true, isImportant: true },
          { id: 't-sadp-103', title: 'Quality Attributes: Performance & Modifiability', completed: true, isImportant: true }
        ]
      },
      {
        id: 'u-sadp-2',
        unitNumber: 2,
        title: 'Architectural Styles and Tactics',
        completed: false,
        topics: [
          { id: 't-sadp-201', title: 'Data-Centered vs Client-Server Styles', completed: false },
          { id: 't-sadp-202', title: 'Layered and Microkernel Architectures', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-sadp-3',
        unitNumber: 3,
        title: 'Creational Design Patterns',
        completed: false,
        topics: [
          { id: 't-sadp-301', title: 'Singleton Pattern (Thread-safe)', completed: false, isImportant: true },
          { id: 't-sadp-302', title: 'Abstract Factory & Builder Patterns', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-sadp-4',
        unitNumber: 4,
        title: 'Structural Design Patterns',
        completed: false,
        topics: [
          { id: 't-sadp-401', title: 'Adapter Pattern vs Bridge Pattern', completed: false, isImportant: true },
          { id: 't-sadp-402', title: 'Decorator and Facade Patterns', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-sadp-5',
        unitNumber: 5,
        title: 'Behavioral Design Patterns & Case Studies',
        completed: false,
        topics: [
          { id: 't-sadp-501', title: 'Observer Pattern in Event Systems', completed: false, isImportant: true },
          { id: 't-sadp-502', title: 'Strategy and Command Patterns', completed: false, isImportant: true }
        ]
      }
    ]
  },
  {
    id: 'sub-dmgt',
    code: 'MA604BS',
    name: 'Discrete Mathematics & Graph Theory (DMGT)',
    priority: 'High',
    color: '#f59e0b',
    examDate: '2026-11-29',
    units: [
      {
        id: 'u-dmgt-1',
        unitNumber: 1,
        title: 'Mathematical Logic and Predicates',
        completed: true,
        topics: [
          { id: 't-dmgt-101', title: 'Propositional Equivalence & Truth Tables', completed: true },
          { id: 't-dmgt-102', title: 'Normal Forms (PDNF & PCNF)', completed: true, isImportant: true }
        ]
      },
      {
        id: 'u-dmgt-2',
        unitNumber: 2,
        title: 'Set Theory, Relations, and Functions',
        completed: false,
        topics: [
          { id: 't-dmgt-201', title: 'Equivalence Relations & Partitions', completed: false, isImportant: true },
          { id: 't-dmgt-202', title: 'Posets, Hasse Diagrams & Lattices', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-dmgt-3',
        unitNumber: 3,
        title: 'Algebraic Structures & Groups',
        completed: false,
        topics: [
          { id: 't-dmgt-301', title: 'Semigroups, Monoids, and Groups', completed: false, isImportant: true },
          { id: 't-dmgt-302', title: 'Lagrange Theorem and Cosets', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-dmgt-4',
        unitNumber: 4,
        title: 'Combinatorics & Recurrence Relations',
        completed: false,
        topics: [
          { id: 't-dmgt-401', title: 'Pigeonhole Principle & Permutations', completed: false },
          { id: 't-dmgt-402', title: 'Solving Homogeneous Recurrence Relations', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-dmgt-5',
        unitNumber: 5,
        title: 'Graph Theory & Trees',
        completed: false,
        topics: [
          { id: 't-dmgt-501', title: 'Euler and Hamiltonian Graphs', completed: false, isImportant: true },
          { id: 't-dmgt-502', title: 'Spanning Trees & Planar Graphs (Euler Formula)', completed: false, isImportant: true }
        ]
      }
    ]
  },
  {
    id: 'sub-iot',
    code: 'CS605PE',
    name: 'Internet of Things (IoT)',
    priority: 'Medium',
    color: '#06b6d4',
    examDate: '2026-12-02',
    units: [
      {
        id: 'u-iot-1',
        unitNumber: 1,
        title: 'Introduction to IoT & Physical Design',
        completed: true,
        topics: [
          { id: 't-iot-101', title: 'IoT Conceptual Framework & Architecture', completed: true },
          { id: 't-iot-102', title: 'IoT Levels and Deployment Templates', completed: true, isImportant: true }
        ]
      },
      {
        id: 'u-iot-2',
        unitNumber: 2,
        title: 'IoT Protocols & Communication Models',
        completed: false,
        topics: [
          { id: 't-iot-201', title: 'MQTT Protocol Architecture & QOS', completed: false, isImportant: true },
          { id: 't-iot-202', title: 'CoAP vs HTTP in Constrained Environments', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-iot-3',
        unitNumber: 3,
        title: 'Sensors, Actuators, and Microcontrollers',
        completed: false,
        topics: [
          { id: 't-iot-301', title: 'Arduino vs Raspberry Pi Interfaces', completed: false },
          { id: 't-iot-302', title: 'Interfacing GPIO, SPI, and I2C Buses', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-iot-4',
        unitNumber: 4,
        title: 'IoT Cloud Platforms & Edge Analytics',
        completed: false,
        topics: [
          { id: 't-iot-401', title: 'Cloud Platforms: AWS IoT Core & ThingSpeak', completed: false, isImportant: true },
          { id: 't-iot-402', title: 'Edge vs Fog Computing in IoT', completed: false }
        ]
      },
      {
        id: 'u-iot-5',
        unitNumber: 5,
        title: 'IoT Applications & Security',
        completed: false,
        topics: [
          { id: 't-iot-501', title: 'Smart City & Industrial IoT (IIoT)', completed: false },
          { id: 't-iot-502', title: 'IoT Attack Vectors & End-to-End Encryption', completed: false, isImportant: true }
        ]
      }
    ]
  },
  {
    id: 'sub-de',
    code: 'EC606ES',
    name: 'Digital Electronics (DE)',
    priority: 'Medium',
    color: '#ec4899',
    examDate: '2026-12-05',
    units: [
      {
        id: 'u-de-1',
        unitNumber: 1,
        title: 'Number Systems & Boolean Algebra',
        completed: true,
        topics: [
          { id: 't-de-101', title: 'Karnaugh Maps (K-Map) 4 & 5 Variables', completed: true, isImportant: true },
          { id: 't-de-102', title: 'Quine-McCluskey Tabular Minimization', completed: true }
        ]
      },
      {
        id: 'u-de-2',
        unitNumber: 2,
        title: 'Combinational Logic Circuits',
        completed: false,
        topics: [
          { id: 't-de-201', title: 'Full Adder & Look-Ahead Carry Adder', completed: false, isImportant: true },
          { id: 't-de-202', title: 'Multiplexers, Demultiplexers & Decoders', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-de-3',
        unitNumber: 3,
        title: 'Sequential Logic & Flip-Flops',
        completed: false,
        topics: [
          { id: 't-de-301', title: 'SR, JK, D, and T Flip-Flops (Excitation Tables)', completed: false, isImportant: true },
          { id: 't-de-302', title: 'Race-around Condition & Master-Slave JK', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-de-4',
        unitNumber: 4,
        title: 'Registers & Synchronous Counters',
        completed: false,
        topics: [
          { id: 't-de-401', title: 'Shift Registers: SISO, SIPO, PISO, PIPO', completed: false },
          { id: 't-de-402', title: 'Design of Synchronous MOD-N Counters', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-de-5',
        unitNumber: 5,
        title: 'Semiconductor Memories & PLDs',
        completed: false,
        topics: [
          { id: 't-de-501', title: 'ROM, PROM, PLA, and PAL Architectures', completed: false, isImportant: true },
          { id: 't-de-502', title: 'FPGA and CPLD Basics', completed: false }
        ]
      }
    ]
  },
  {
    id: 'sub-es',
    code: 'EC607PC',
    name: 'Embedded Systems (ES)',
    priority: 'Medium',
    color: '#14b8a6',
    examDate: '2026-12-08',
    units: [
      {
        id: 'u-es-1',
        unitNumber: 1,
        title: 'Introduction to Embedded System Design',
        completed: false,
        topics: [
          { id: 't-es-101', title: 'Embedded vs General Purpose Computing', completed: false },
          { id: 't-es-102', title: 'Core Processors: Microprocessors, DSP, ASICs', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-es-2',
        unitNumber: 2,
        title: 'ARM Cortex Architecture',
        completed: false,
        topics: [
          { id: 't-es-201', title: 'ARM Registers, Pipeline & Operating Modes', completed: false, isImportant: true },
          { id: 't-es-202', title: 'Thumb-2 Instruction Set Overview', completed: false }
        ]
      },
      {
        id: 'u-es-3',
        unitNumber: 3,
        title: 'Embedded Communication Protocols',
        completed: false,
        topics: [
          { id: 't-es-301', title: 'I2C and SPI Protocol Timing Diagrams', completed: false, isImportant: true },
          { id: 't-es-302', title: 'CAN Bus & UART Protocols', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-es-4',
        unitNumber: 4,
        title: 'Real-Time Operating Systems (RTOS)',
        completed: false,
        topics: [
          { id: 't-es-401', title: 'Hard vs Soft RTOS Scheduling', completed: false, isImportant: true },
          { id: 't-es-402', title: 'Priority Inversion and Priority Ceiling', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-es-5',
        unitNumber: 5,
        title: 'Embedded Firmware & Debugging',
        completed: false,
        topics: [
          { id: 't-es-501', title: 'Watchdog Timers and Power Management', completed: false },
          { id: 't-es-502', title: 'JTAG and In-Circuit Emulators (ICE)', completed: false, isImportant: true }
        ]
      }
    ]
  },
  {
    id: 'sub-ads',
    code: 'CS608PC',
    name: 'Advanced Data Structures (ADS)',
    priority: 'High',
    color: '#ef4444',
    examDate: '2026-12-11',
    units: [
      {
        id: 'u-ads-1',
        unitNumber: 1,
        title: 'Balanced Search Trees',
        completed: true,
        topics: [
          { id: 't-ads-101', title: 'AVL Tree Rotations and Height Analysis', completed: true, isImportant: true },
          { id: 't-ads-102', title: 'Red-Black Tree Properties and Insertions', completed: true, isImportant: true }
        ]
      },
      {
        id: 'u-ads-2',
        unitNumber: 2,
        title: 'Multi-Way Trees and B-Trees',
        completed: false,
        topics: [
          { id: 't-ads-201', title: 'B-Tree Order, Insertion, and Deletion', completed: false, isImportant: true },
          { id: 't-ads-202', title: 'B+ Tree Indexing in Databases', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-ads-3',
        unitNumber: 3,
        title: 'Advanced Heaps and Priority Queues',
        completed: false,
        topics: [
          { id: 't-ads-301', title: 'Binomial Heaps and Union Operations', completed: false, isImportant: true },
          { id: 't-ads-302', title: 'Fibonacci Heaps & Amortized Complexity', completed: false, isImportant: true }
        ]
      },
      {
        id: 'u-ads-4',
        unitNumber: 4,
        title: 'Disjoint Sets and Dynamic Hashing',
        completed: false,
        topics: [
          { id: 't-ads-401', title: 'Disjoint Set Union by Rank and Path Compression', completed: false, isImportant: true },
          { id: 't-ads-402', title: 'Extendible and Linear Hashing', completed: false }
        ]
      },
      {
        id: 'u-ads-5',
        unitNumber: 5,
        title: 'String Matching Algorithms & Tries',
        completed: false,
        topics: [
          { id: 't-ads-501', title: 'Knuth-Morris-Pratt (KMP) Algorithm', completed: false, isImportant: true },
          { id: 't-ads-502', title: 'Standard, Compressed, and Suffix Tries', completed: false, isImportant: true }
        ]
      }
    ]
  }
];

export const INITIAL_TASKS: DailyTask[] = [
  {
    id: 'task-1',
    subjectId: 'sub-bda',
    unitId: 'u-bda-3',
    title: 'Solve CAP Theorem & HBase Architecture 7-Mark PYQ',
    scheduledDate: new Date().toISOString().split('T')[0],
    slot: 'Morning',
    completed: false,
    rescheduledCount: 0
  },
  {
    id: 'task-2',
    subjectId: 'sub-ads',
    unitId: 'u-ads-2',
    title: 'Practice B-Tree order 4 insertion and deletion numericals',
    scheduledDate: new Date().toISOString().split('T')[0],
    slot: 'Afternoon',
    completed: false,
    rescheduledCount: 0
  },
  {
    id: 'task-3',
    subjectId: 'sub-sadp',
    unitId: 'u-sadp-3',
    title: 'Implement thread-safe Singleton and Abstract Factory in Java',
    scheduledDate: new Date().toISOString().split('T')[0],
    slot: 'Night',
    completed: false,
    rescheduledCount: 0
  }
];

export const INITIAL_REVISIONS: RevisionItem[] = [
  {
    id: 'rev-1',
    subjectId: 'sub-bda',
    unitId: 'u-bda-1',
    topicTitle: 'HDFS Architecture & NameNode Federation',
    initialDate: '2026-11-01',
    rev1Date: '2026-11-02',
    rev1Done: true,
    rev2Date: '2026-11-08',
    rev2Done: false,
    rev3Date: '2026-12-01',
    rev3Done: false
  },
  {
    id: 'rev-2',
    subjectId: 'sub-ads',
    unitId: 'u-ads-1',
    topicTitle: 'AVL Tree Rotations (RR, LL, RL, LR)',
    initialDate: '2026-11-02',
    rev1Date: '2026-11-03',
    rev1Done: false,
    rev2Date: '2026-11-09',
    rev2Done: false,
    rev3Date: '2026-12-02',
    rev3Done: false
  }
];

export const INITIAL_BACKLOGS: Backlog[] = [
  {
    id: 'bl-1',
    subjectName: 'Formal Languages and Automata Theory (FLAT)',
    subjectCode: 'CS402PC',
    semester: 4,
    attemptNumber: 2,
    preparationStatus: 'In Progress',
    examDate: '2026-12-18',
    resultStatus: 'Pending',
    checklist: {
      syllabusCovered: true,
      pyqSolved: false,
      revisionDone: false
    }
  }
];

export const INITIAL_EXAMS: Exam[] = [
  { id: 'ex-1', subjectId: 'sub-bda', examDate: '2026-11-20T10:00:00', examType: 'Semester Final', targetScore: 90, room: 'Examination Hall 302' },
  { id: 'ex-2', subjectId: 'sub-hrpm', examDate: '2026-11-23T10:00:00', examType: 'Semester Final', targetScore: 85, room: 'Examination Hall 105' },
  { id: 'ex-3', subjectId: 'sub-sadp', examDate: '2026-11-26T10:00:00', examType: 'Semester Final', targetScore: 88, room: 'Examination Hall 201' },
  { id: 'ex-4', subjectId: 'sub-dmgt', examDate: '2026-11-29T10:00:00', examType: 'Semester Final', targetScore: 95, room: 'Examination Hall 304' },
  { id: 'ex-5', subjectId: 'sub-iot', examDate: '2026-12-02T10:00:00', examType: 'Semester Final', targetScore: 85, room: 'Examination Hall 102' },
  { id: 'ex-6', subjectId: 'sub-de', examDate: '2026-12-05T10:00:00', examType: 'Semester Final', targetScore: 82, room: 'Examination Hall 204' },
  { id: 'ex-7', subjectId: 'sub-es', examDate: '2026-12-08T10:00:00', examType: 'Semester Final', targetScore: 80, room: 'Examination Hall 301' },
  { id: 'ex-8', subjectId: 'sub-ads', examDate: '2026-12-11T10:00:00', examType: 'Semester Final', targetScore: 90, room: 'Examination Hall 401' }
];
