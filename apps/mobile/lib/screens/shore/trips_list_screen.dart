import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../../widgets/shore_layout.dart';

class TripsListScreen extends StatefulWidget {
  const TripsListScreen({super.key});
  @override
  State<TripsListScreen> createState() => _State();
}

class _State extends State<TripsListScreen> {
  List<Map<String, dynamic>> trips = [];
  String search = '';
  String sort = 'time';
  bool loading = true;
  String? error;
  @override
  void initState() {
    super.initState();
    _load();
    ApiService.instance.addListener(_load);
  }

  @override
  void dispose() {
    ApiService.instance.removeListener(_load);
    super.dispose();
  }

  Future<void> _load() async {
    try {
      final data = await ApiService.instance.trips();
      if (mounted)
        setState(() {
          trips = data;
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

  List<Map<String, dynamic>> get visible {
    final q = search.trim().toLowerCase();
    final result = trips
        .where((t) => [
              t['vesselName'],
              t['ownerName'],
              t['registrationNumber'],
              t['shoreApproval']
            ].any((v) => v?.toString().toLowerCase().contains(q) ?? false))
        .toList();
    result.sort((a, b) => sort == 'vessel'
        ? (a['vesselName'] ?? '').compareTo(b['vesselName'] ?? '')
        : (a['scheduledDepartureUtc'] ?? '')
            .compareTo(b['scheduledDepartureUtc'] ?? ''));
    return result;
  }

  Map<String, dynamic> _args(Map<String, dynamic> t) => {
        'id': t['id'],
        'vessel': t['vesselName'],
        'owner': t['ownerName'],
        'reg': t['registrationNumber'],
        'time': DateTime.tryParse(t['scheduledDepartureUtc']?.toString() ?? '')
            ?.toLocal()
            .toString(),
        'status': t['shoreApproval'],
        'crew': t['crew'] ?? const [],
        'raw': t
      };
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
                      child: Container(
                          decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              boxShadow: const [
                                BoxShadow(
                                    color: Color(0x0F0F172A),
                                    blurRadius: 30,
                                    offset: Offset(0, 8))
                              ]),
                          child: Column(children: [
                            _heading(c.maxWidth),
                            const Divider(height: 1, color: Color(0xFFF1F5F9)),
                            if (loading)
                              const Padding(
                                  padding: EdgeInsets.all(60),
                                  child: CircularProgressIndicator())
                            else if (error != null)
                              Padding(
                                  padding: const EdgeInsets.all(60),
                                  child: Text(error!,
                                      style:
                                          const TextStyle(color: Colors.red)))
                            else if (c.maxWidth >= 760)
                              _table()
                            else
                              _cards(),
                            if (!loading && visible.isEmpty)
                              const Padding(
                                  padding: EdgeInsets.all(56),
                                  child: Text('No trips match your search.',
                                      style: TextStyle(color: shoreMuted)))
                          ])))))));
  Widget _heading(double width) {
    final controls = width >= 520
        ? Row(children: [
            Expanded(
                child: TextField(
                    onChanged: (v) => setState(() => search = v),
                    decoration: InputDecoration(
                        isDense: true,
                        hintText: 'Search',
                        prefixIcon: const Icon(Icons.search, size: 18),
                        border: OutlineInputBorder(
                            borderSide:
                                const BorderSide(color: Color(0xFFE2E8F0)),
                            borderRadius: BorderRadius.circular(6))))),
            const SizedBox(width: 12),
            Expanded(
                child: DropdownButtonFormField<String>(
                    initialValue: sort,
                    decoration: InputDecoration(
                        isDense: true,
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(6))),
                    items: const [
                      DropdownMenuItem(
                          value: 'time', child: Text('Sort by Time')),
                      DropdownMenuItem(
                          value: 'vessel', child: Text('Sort by Vessel'))
                    ],
                    onChanged: (v) => setState(() => sort = v ?? 'time'))),
          ])
        : Column(children: [
            TextField(
                onChanged: (v) => setState(() => search = v),
                decoration: InputDecoration(
                    isDense: true,
                    hintText: 'Search',
                    prefixIcon: const Icon(Icons.search, size: 18),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(6)))),
            const SizedBox(height: 10),
            DropdownButtonFormField<String>(
                initialValue: sort,
                isExpanded: true,
                decoration: InputDecoration(
                    isDense: true,
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(6))),
                items: const [
                  DropdownMenuItem(value: 'time', child: Text('Sort by Time')),
                  DropdownMenuItem(
                      value: 'vessel', child: Text('Sort by Vessel'))
                ],
                onChanged: (v) => setState(() => sort = v ?? 'time')),
          ]);
    return Padding(
        padding: EdgeInsets.symmetric(
            horizontal: width >= 900 ? 28 : 18,
            vertical: width >= 700 ? 22 : 16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          _title(),
          const SizedBox(height: 16),
          SizedBox(width: double.infinity, child: controls)
        ]));
  }

  Widget _title() =>
      const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Scheduled Trips',
            style: TextStyle(
                fontSize: 20, fontWeight: FontWeight.w600, color: shoreInk)),
        SizedBox(height: 5),
        Text('Review and authorize scheduled vessel departures.',
            style: TextStyle(fontSize: 12, color: shoreMuted))
      ]);
  Widget _table() => LayoutBuilder(
      builder: (context, constraints) => SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: ConstrainedBox(
              constraints: BoxConstraints(minWidth: constraints.maxWidth),
              child: DataTable(
                  horizontalMargin: 28,
                  columnSpacing: 48,
                  headingRowHeight: 52,
                  dataRowMinHeight: 60,
                  dataRowMaxHeight: 72,
                  headingRowColor:
                      WidgetStateProperty.all(const Color(0xFFF8FAFC)),
                  headingTextStyle: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF64748B)),
                  dataTextStyle:
                      const TextStyle(fontSize: 13, color: Color(0xFF475569)),
                  columns: const [
                    DataColumn(label: Text('Vessel')),
                    DataColumn(label: Text('Owner')),
                    DataColumn(label: Text('Registration No.')),
                    DataColumn(label: Text('Scheduled Time')),
                    DataColumn(label: Text('Approval')),
                    DataColumn(label: Text('Action'))
                  ],
                  rows: visible
                      .map((t) => DataRow(cells: [
                            DataCell(Text(t['vesselName']?.toString() ?? '',
                                style: const TextStyle(
                                    fontWeight: FontWeight.w500,
                                    color: shoreInk))),
                            DataCell(Text(t['ownerName']?.toString() ?? '')),
                            DataCell(Text(
                                t['registrationNumber']?.toString() ?? '')),
                            DataCell(Text(DateTime.tryParse(
                                        t['scheduledDepartureUtc']
                                                ?.toString() ??
                                            '')
                                    ?.toLocal()
                                    .toString() ??
                                '')),
                            DataCell(_status(
                                t['shoreApproval']?.toString() ?? 'Pending')),
                            DataCell(OutlinedButton(
                                onPressed: () => Navigator.pushNamed(
                                    context, '/vessel_details',
                                    arguments: _args(t)),
                                style: OutlinedButton.styleFrom(
                                    foregroundColor: shoreIndigo,
                                    side: const BorderSide(
                                        color: Color(0xFFC7D2FE)),
                                    shape: const StadiumBorder()),
                                child: const Text('Review',
                                    style: TextStyle(fontSize: 12))))
                          ]))
                      .toList()))));
  Widget _cards() => Column(
      children: visible
          .map((t) => InkWell(
              onTap: () => Navigator.pushNamed(context, '/vessel_details',
                  arguments: _args(t)),
              child: Container(
                  width: double.infinity,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 18, vertical: 20),
                  decoration: const BoxDecoration(
                      border:
                          Border(bottom: BorderSide(color: Color(0xFFF1F5F9)))),
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                  child: Text(t['vesselName']?.toString() ?? '',
                                      style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.bold,
                                          color: shoreInk))),
                              _status(
                                  t['shoreApproval']?.toString() ?? 'Pending')
                            ]),
                        const SizedBox(height: 8),
                        Text('${t['registrationNumber']} · ${t['ownerName']}',
                            style: const TextStyle(
                                fontSize: 12, color: Color(0xFF64748B))),
                        const SizedBox(height: 4),
                        Text(
                            DateTime.tryParse(t['scheduledDepartureUtc']
                                            ?.toString() ??
                                        '')
                                    ?.toLocal()
                                    .toString() ??
                                '',
                            style: const TextStyle(
                                fontSize: 12, color: shoreMuted))
                      ]))))
          .toList());
  Widget _status(String status) {
    final approved = status == 'Approved', rejected = status == 'Rejected';
    return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
            color: approved
                ? const Color(0xFFECFDF5)
                : rejected
                    ? const Color(0xFFFEF2F2)
                    : const Color(0xFFFFFBEB),
            borderRadius: BorderRadius.circular(20)),
        child: Text(status,
            style: TextStyle(
                fontSize: 11,
                color: approved
                    ? const Color(0xFF059669)
                    : rejected
                        ? const Color(0xFFDC2626)
                        : const Color(0xFFD97706))));
  }
}
