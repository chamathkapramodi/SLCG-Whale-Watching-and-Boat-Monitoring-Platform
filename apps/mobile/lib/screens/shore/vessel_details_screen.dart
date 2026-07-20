import 'dart:async';
import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../widgets/shore_layout.dart';

class VesselDetailsScreen extends StatefulWidget {
  const VesselDetailsScreen({super.key});
  @override
  State<VesselDetailsScreen> createState() => _State();
}

class _State extends State<VesselDetailsScreen> {
  List<Map<String, dynamic>> passengers = [];
  bool loading = true;
  String? error;
  Map<String, dynamic> trip = {};
  Timer? refreshTimer;
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (trip.isEmpty) {
      trip = (ModalRoute.of(context)?.settings.arguments
              as Map<String, dynamic>?) ??
          {};
      _load();
      ApiService.instance.addListener(_load);
      refreshTimer = Timer.periodic(const Duration(seconds: 5), (_) => _load());
    }
  }

  @override
  void dispose() {
    refreshTimer?.cancel();
    ApiService.instance.removeListener(_load);
    super.dispose();
  }

  Future<void> _load() async {
    final id = trip['id']?.toString();
    if (id == null) return;
    try {
      final results = await Future.wait([
        ApiService.instance.tripPassengers(id),
        ApiService.instance.trips(),
      ]);
      final data = results[0];
      final latestTrips = results[1];
      final latest = latestTrips
          .where((record) => record['id']?.toString() == id)
          .firstOrNull;
      if (mounted)
        setState(() {
          passengers = data;
          if (latest != null) {
            trip['vessel'] = latest['vesselName'];
            trip['owner'] = latest['ownerName'];
            trip['reg'] = latest['registrationNumber'];
            trip['status'] = latest['shoreApproval'];
            trip['crew'] = latest['crew'] ?? const [];
            trip['raw'] = latest;
          }
          loading = false;
          error = null;
        });
    } catch (e) {
      if (mounted)
        setState(() {
          loading = false;
          error = e.toString();
        });
    }
  }

  List<Map<String, dynamic>> get crew => ((trip['crew'] as List?) ?? const [])
      .map((item) => (item as Map).cast<String, dynamic>())
      .toList();
  @override
  Widget build(BuildContext context) => ShoreLayout(
      active: 'trips',
      child: LayoutBuilder(
          builder: (context, c) => SingleChildScrollView(
              padding: EdgeInsets.symmetric(
                  horizontal: c.maxWidth >= 1100
                      ? 32
                      : c.maxWidth >= 700
                          ? 22
                          : 12,
                  vertical: c.maxWidth >= 700 ? 24 : 14),
              child: Center(
                  child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 1280),
                      child: c.maxWidth >= 1050
                          ? Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                  SizedBox(width: 300, child: _vessel()),
                                  const SizedBox(width: 24),
                                  Expanded(child: _manifest())
                                ])
                          : Column(children: [
                              _vessel(),
                              const SizedBox(height: 20),
                              _manifest()
                            ]))))));
  Widget _vessel() {
    final raw = (trip['raw'] as Map?)?.cast<String, dynamic>() ?? {};
    return Container(
        width: double.infinity,
        decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [
              BoxShadow(color: Color(0x0D0F172A), blurRadius: 14)
            ]),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          ClipRRect(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(12)),
              child: Image.asset('assets/images/fv_mirissa_king.jpg',
                  height: 208,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                      height: 208,
                      color: const Color(0xFFCBD5E1),
                      child: const Center(
                          child: Icon(Icons.directions_boat,
                              size: 72, color: Colors.white))))),
          Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(trip['vessel']?.toString() ?? 'Vessel',
                        style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w600,
                            color: shoreInk)),
                    const SizedBox(height: 4),
                    Text(trip['reg']?.toString() ?? '',
                        style:
                            const TextStyle(fontSize: 12, color: shoreMuted)),
                    const SizedBox(height: 24),
                    Wrap(runSpacing: 16, children: [
                      _detail('Owner', trip['owner']?.toString() ?? ''),
                      _detail('Departure', trip['time']?.toString() ?? 'TBA'),
                      _detail('Passengers', '${passengers.length}'),
                      _detail(
                          'Status', trip['status']?.toString() ?? 'Pending'),
                      _detail('Route',
                          raw['route']?.toString() ?? 'To be confirmed'),
                      _detail('Trip state',
                          raw['status']?.toString() ?? 'Scheduled')
                    ])
                  ]))
        ]));
  }

  Widget _detail(String label, String value) => SizedBox(
      width: 130,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label, style: const TextStyle(fontSize: 11, color: shoreMuted)),
        const SizedBox(height: 4),
        Text(value,
            style: const TextStyle(
                fontSize: 12, fontWeight: FontWeight.w500, color: shoreInk))
      ]));
  Widget _manifest() => Column(children: [
        _dataCard(
            'Passengers (${passengers.length})',
            ['Name', 'NIC or Passport', 'Age', 'Passenger type'],
            passengers
                .map((p) => [
                      p['name'],
                      p['identificationNumber'],
                      p['ageCategory'],
                      p['passengerType']
                    ].map((v) => v?.toString() ?? '').toList())
                .toList(),
            loading
                ? null
                : error ?? 'No passengers registered for this trip.'),
        const SizedBox(height: 20),
        LayoutBuilder(
            builder: (context, c) => c.maxWidth >= 760
                ? Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Expanded(child: _crew()),
                    const SizedBox(width: 24),
                    SizedBox(width: 260, child: _approval())
                  ])
                : Column(children: [
                    _crew(),
                    const SizedBox(height: 20),
                    _approval()
                  ]))
      ]);
  Widget _crew() => _dataCard(
      'Crew (${crew.length})',
      ['Name', 'NIC', 'Role', 'Certified'],
      crew
          .map((m) => [
                m['name']?.toString() ?? '',
                m['nicNumber']?.toString().isNotEmpty == true
                    ? m['nicNumber'].toString()
                    : 'Not provided',
                m['position']?.toString() ?? 'Crew Member',
                m['certified'] == true ? 'Yes' : 'No'
              ])
          .toList(),
      'No crew assigned to this trip.');
  Widget _dataCard(String title, List<String> columns, List<List<String>> rows,
          String? empty) =>
      Container(
          width: double.infinity,
          decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: const [
                BoxShadow(color: Color(0x0D0F172A), blurRadius: 14)
              ]),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                child: Text(title,
                    style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: shoreInk))),
            const Divider(height: 1, color: Color(0xFFF1F5F9)),
            if (loading && title.startsWith('Passengers'))
              const Padding(
                  padding: EdgeInsets.all(36),
                  child: Center(child: CircularProgressIndicator()))
            else if (rows.isEmpty)
              Padding(
                  padding: const EdgeInsets.all(32),
                  child: Center(
                      child: Text(empty ?? 'No records.',
                          style: const TextStyle(
                              fontSize: 12, color: shoreMuted))))
            else
              _responsiveTable(columns, rows,
                  limitToFive: title.startsWith('Passengers'))
          ]));

  Widget _responsiveTable(List<String> columns, List<List<String>> rows,
          {required bool limitToFive}) =>
      LayoutBuilder(builder: (context, constraints) {
        final compact = constraints.maxWidth < 560;
        final horizontalPadding = compact ? 12.0 : 18.0;
        final columnWidths = <int, TableColumnWidth>{
          0: const FlexColumnWidth(1.35),
          1: const FlexColumnWidth(1.35),
          2: const FlexColumnWidth(.85),
          3: const FlexColumnWidth(1.0),
        };
        final header = Table(
            columnWidths: columnWidths,
            defaultVerticalAlignment: TableCellVerticalAlignment.middle,
            children: [
              TableRow(
                  decoration: const BoxDecoration(color: Color(0xFFF8FAFC)),
                  children: columns
                      .map((value) => _tableCell(value,
                          heading: true,
                          horizontalPadding: horizontalPadding,
                          compact: compact))
                      .toList()),
            ]);
        final body = Table(
            columnWidths: columnWidths,
            defaultVerticalAlignment: TableCellVerticalAlignment.middle,
            border: const TableBorder(
                horizontalInside: BorderSide(color: Color(0xFFF1F5F9))),
            children: rows
                .map((row) => TableRow(
                    children: row
                        .map((value) => _tableCell(value,
                            horizontalPadding: horizontalPadding,
                            compact: compact))
                        .toList()))
                .toList());
        final bodyContent = limitToFive
            ? ConstrainedBox(
                constraints: const BoxConstraints(maxHeight: 310),
                child: Scrollbar(
                    child: SingleChildScrollView(
                        primary: false,
                        child: SizedBox(
                            width: constraints.maxWidth, child: body))))
            : body;
        return SizedBox(
            width: double.infinity,
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [header, bodyContent]));
      });

  Widget _tableCell(String value,
          {bool heading = false,
          required double horizontalPadding,
          required bool compact}) =>
      Padding(
          padding: EdgeInsets.symmetric(
              horizontal: horizontalPadding, vertical: heading ? 16 : 18),
          child: Text(value,
              maxLines: compact ? 3 : 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                  fontSize: compact
                      ? 10
                      : heading
                          ? 11
                          : 12,
                  height: 1.35,
                  fontWeight: heading ? FontWeight.w500 : FontWeight.w400,
                  color: heading
                      ? const Color(0xFF64748B)
                      : const Color(0xFF475569))));
  Widget _approval() => Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: const [
            BoxShadow(color: Color(0x0D0F172A), blurRadius: 14)
          ]),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('Approval',
            style: TextStyle(
                fontSize: 20, fontWeight: FontWeight.w600, color: shoreInk)),
        const SizedBox(height: 12),
        const Text(
            'Inspection completed. Verify the vessel, crew, passenger capacity, and safety requirements before authorization.',
            style:
                TextStyle(fontSize: 12, height: 1.6, color: Color(0xFF64748B))),
        const SizedBox(height: 24),
        SizedBox(
            width: double.infinity,
            child: ElevatedButton(
                onPressed: () => _decide(true),
                style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6)),
                    padding: const EdgeInsets.symmetric(vertical: 14)),
                child: const Text('Approve',
                    style: TextStyle(fontWeight: FontWeight.w600)))),
        const SizedBox(height: 12),
        SizedBox(
            width: double.infinity,
            child: ElevatedButton(
                onPressed: () => _decide(false),
                style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEF4444),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6)),
                    padding: const EdgeInsets.symmetric(vertical: 14)),
                child: const Text('Decline',
                    style: TextStyle(fontWeight: FontWeight.w600))))
      ]));
  Future<void> _decide(bool approved) async {
    final id = trip['id']?.toString();
    if (id == null) return;
    try {
      await ApiService.instance.approve(id, approved ? 'Approved' : 'Rejected');
      if (!mounted) return;
      setState(() => trip['status'] = approved ? 'Approved' : 'Rejected');
      await showDialog<void>(
          context: context,
          builder: (dialog) => AlertDialog(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10)),
                  icon: CircleAvatar(
                      backgroundColor: approved
                          ? const Color(0xFF10B981)
                          : const Color(0xFFEF4444),
                      child: Icon(approved ? Icons.check : Icons.priority_high,
                          color: Colors.white)),
                  title: Text(approved
                      ? 'Ride Successfully Authorized'
                      : 'Ride Not Authorized'),
                  content: Text(approved
                      ? 'Authorization has been completed successfully. All required checks have been verified.'
                      : 'The authorization request has been declined. The owner must resolve the identified issues.'),
                  actions: [
                    SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                            onPressed: () => Navigator.pop(dialog),
                            style: ElevatedButton.styleFrom(
                                backgroundColor: approved
                                    ? const Color(0xFF10B981)
                                    : const Color(0xFFEF4444),
                                foregroundColor: Colors.white),
                            child: const Text('Continue')))
                  ]));
    } catch (e) {
      if (mounted)
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }
}
