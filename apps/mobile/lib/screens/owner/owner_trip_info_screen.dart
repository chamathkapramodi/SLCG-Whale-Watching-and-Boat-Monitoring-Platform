import 'package:flutter/material.dart';
import '../../../widgets/owner_layout.dart';

class OwnerTripInfoScreen extends StatelessWidget {
  const OwnerTripInfoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return OwnerLayout(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Section: Info & QR
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  flex: 1,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Boat", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black)),
                      const Text("Mirissa King", style: TextStyle(fontSize: 16, color: Colors.black87)),
                      const SizedBox(height: 16),
                      const Text("Time", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black)),
                      const Text("06:30 AM", style: TextStyle(fontSize: 16, color: Colors.black87)),
                      const SizedBox(height: 16),
                      const Text("Date", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black)),
                      const Text("Tue, 23 June", style: TextStyle(fontSize: 16, color: Colors.black87)),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFF34D399), shape: BoxShape.circle)),
                          const SizedBox(width: 6),
                          const Text("APPROVED", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF34D399))),
                        ],
                      )
                    ],
                  ),
                ),
                // QR Code Placeholder
                Expanded(
                  flex: 1,
                  child: AspectRatio(
                    aspectRatio: 1,
                    child: Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.black, width: 2),
                      ),
                      child: const Center(
                        child: Icon(Icons.qr_code_2, size: 100, color: Colors.black),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            
            // Passenger Info
            const Text("Passenger Info", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.black)),
            const SizedBox(height: 16),
            
            // Search / Sort
            Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: "Search", hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 12),
                      prefixIcon: const Icon(Icons.search, color: Colors.grey, size: 16),
                      border: InputBorder.none, isDense: true, contentPadding: EdgeInsets.zero,
                    ),
                  ),
                ),
                const Icon(Icons.mic_none, color: Colors.grey, size: 16),
                const SizedBox(width: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(4)),
                  child: const Row(
                    children: [
                      Text("Sort by : Name", style: TextStyle(fontSize: 8, color: Colors.black87)),
                      SizedBox(width: 4),
                      Icon(Icons.keyboard_arrow_down, size: 12, color: Colors.black87)
                    ],
                  ),
                )
              ],
            ),
            const SizedBox(height: 16),
            
            // Passenger Table
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                headingRowHeight: 40,
                dataRowMinHeight: 40,
                dataRowMaxHeight: 40,
                columnSpacing: 24,
                columns: const [
                  DataColumn(label: Text('Name', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold))),
                  DataColumn(label: Text('NIC or PassPort', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold))),
                  DataColumn(label: Text('Age', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold))),
                  DataColumn(label: Text('Nationality', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold))),
                ],
                rows: [
                  _buildPassengerRow("Rathnayake M.", "20032131313", "Adult", "Local"),
                  _buildPassengerRow("Rathnayake M.", "20032131313", "Adult", "Local"),
                  _buildPassengerRow("Rathnayake M.", "20032131313", "Adult", "Local"),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Emergencies Button
            SizedBox(
              width: double.infinity, height: 56,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF34D399), // Neon Green
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                icon: const Icon(Icons.notifications_none, size: 20),
                label: const Text("No Emergencies", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                onPressed: () {},
              ),
            ),
            const SizedBox(height: 24),

            // Map Placeholder
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.asset(
                'assets/images/map_placeholder.jpg',
                width: double.infinity,
                height: 250,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    width: double.infinity, height: 250,
                    color: Colors.blue.shade100,
                    child: const Center(child: Text("Map Asset Missing\n(Add map_placeholder.jpg)", textAlign: TextAlign.center)),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  DataRow _buildPassengerRow(String name, String nic, String age, String nat) {
    return DataRow(
      cells: [
        DataCell(Text(name, style: const TextStyle(fontSize: 10))),
        DataCell(Text(nic, style: const TextStyle(fontSize: 10))),
        DataCell(Text(age, style: const TextStyle(fontSize: 10))),
        DataCell(Text(nat, style: const TextStyle(fontSize: 10))),
      ],
    );
  }
}