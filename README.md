# ⚡ VoltCharge - Smart EV Charging Platform

A commercial-grade EV charging platform engineered with a resilient **Distributed Systems** backend.

---

## 🌟 Overview

**VoltCharge** delivers an end-to-end electric vehicle charging experience across three distinct, role-based portals:
- 🚗 **EV Driver Portal**: Find nearby chargers, view real-time station availability, reserve slots without race conditions, and monitor live charging telemetry (battery percentage, power kW, kWh delivered).
- 🔧 **Station Operator Portal**: Manage charging stations, monitor connector health, and handle maintenance repairs.
- 🛡️ **Administrator Portal**: Oversee user accounts, network operations, revenue, and system analytics.

---

## 🔬 Distributed Systems Engine (Backend)

Behind the scenes, VoltCharge implements core Distributed Systems principles:

1. **Microservice Node Architecture** (Decoupled cluster):
   - `Node-01-Booking` (Port 8081): Manages slot reservations and mutual exclusion locks.
   - `Node-02-Station` (Port 8082): Telemetry streaming and hardware connector state.
   - `Node-03-Payment` (Port 8083): Billing and Saga compensation transactions.
   - `Node-04-Routing` (Port 8084): Coordinator node and trip route recommendations.
2. **Distributed Mutual Exclusion**:
   - Zero double-booking guarantee via Lamport priority queue-based lock manager.
3. **Logical Clocks (Lamport Timestamps & Vector Clocks)**:
   - Tracks causal message ordering across nodes.
4. **Leader Election & Heartbeat Consensus**:
   - Bully Election algorithm automatically promotes a new coordinator when heartbeats fail.
5. **Saga Pattern (Compensating Transactions)**:
   - Multi-step booking/payment orchestration with automated rollback when payment fails.
6. **Real-Time Telemetry**:
   - WebSocket streaming for live charging stats (battery %, delivered kWh, charging power, real-time cost).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, TypeScript, WebSockets (`ws`)
- **Architecture**: Distributed microservice emulation, Saga Orchestrator, Redlock-style lock manager

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (v9 or higher)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Keyura-0910/Voltcharge-DS-Project.git
   cd Voltcharge-DS-Project
   ```

2. **Install dependencies**:
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   cd ..
   ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```

4. **Access the Portals**:
   - **EV Driver Portal**: `http://localhost:3000/driver/login`
   - **Station Operator Portal**: `http://localhost:3000/operator/login`
   - **Administrator Portal**: `http://localhost:3000/admin/login`
   - **Backend API**: `http://localhost:5000/api`
