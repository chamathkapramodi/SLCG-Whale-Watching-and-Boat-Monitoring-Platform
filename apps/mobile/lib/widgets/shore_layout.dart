import 'package:flutter/material.dart';
import '../services/api_service.dart';

const shoreInk = Color(0xFF14223D);
const shoreBackground = Color(0xFFF8F9FB);
const shoreMuted = Color(0xFF94A3B8);
const shoreIndigo = Color(0xFF4F46E5);

class ShoreLayout extends StatelessWidget {
  final Widget child;
  final String active;
  const ShoreLayout({super.key, required this.child, this.active = 'home'});

  @override
  Widget build(BuildContext context) => Theme(
        data: ThemeData.light().copyWith(
          scaffoldBackgroundColor: shoreBackground,
          colorScheme: ColorScheme.fromSeed(seedColor: shoreIndigo),
          textTheme: ThemeData.light().textTheme.apply(
              fontFamily: 'Poppins',
              bodyColor: shoreInk,
              displayColor: shoreInk),
        ),
        child: Scaffold(
          backgroundColor: shoreBackground,
          drawer:
              MediaQuery.sizeOf(context).width < 1100 ? _drawer(context) : null,
          body: SafeArea(
            top: true,
            bottom: true,
            child: Column(children: [
              Builder(builder: (navContext) => _navbar(navContext)),
              Expanded(child: child),
            ]),
          ),
        ),
      );

  Widget _navbar(BuildContext context) {
    final wide = MediaQuery.sizeOf(context).width >= 1100;
    return Container(
      height: 56,
      padding: EdgeInsets.symmetric(horizontal: wide ? 28 : 14),
      decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(bottom: BorderSide(color: Color(0xFFE2E8F0))),
          boxShadow: [
            BoxShadow(
                color: Color(0x0D0F172A), blurRadius: 8, offset: Offset(0, 2))
          ]),
      child: Row(children: [
        InkWell(
            onTap: () => Navigator.pushNamedAndRemoveUntil(
                context, '/shore_dashboard', (_) => false),
            child: Image.asset('assets/images/slcg_logo.png',
                height: 34,
                errorBuilder: (_, __, ___) =>
                    const Icon(Icons.anchor, color: shoreInk, size: 34))),
        const Spacer(),
        if (wide) ...[
          _iconLink(context, Icons.notifications_none, '/shore_notifications',
              'notifications'),
          const SizedBox(width: 16),
          _textLink(
              context,
              active == 'trips' ? 'Home' : 'Trips',
              active == 'trips' ? '/shore_dashboard' : '/trips_list',
              active == 'trips' ? 'home' : 'trips'),
          const SizedBox(width: 18),
          _textLink(context, 'Settings', '/shore_settings', 'settings'),
          const SizedBox(width: 18),
          ElevatedButton(
              onPressed: () => _logout(context),
              style: ElevatedButton.styleFrom(
                  backgroundColor: shoreInk,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 11),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(6))),
              child: const Text('Log Out',
                  style: TextStyle(fontWeight: FontWeight.w600))),
        ] else
          IconButton(
              onPressed: () => Scaffold.of(context).openDrawer(),
              icon: const Icon(Icons.menu, color: shoreInk)),
      ]),
    );
  }

  Widget _textLink(
          BuildContext context, String label, String route, String key) =>
      TextButton(
          onPressed: () => Navigator.pushNamed(context, route),
          child: Text(label,
              style: TextStyle(
                  color: active == key ? shoreInk : const Color(0xFF64748B),
                  fontWeight: FontWeight.w500)));
  Widget _iconLink(
          BuildContext context, IconData icon, String route, String key) =>
      IconButton(
          onPressed: () => Navigator.pushNamed(context, route),
          icon: Icon(icon,
              color: active == key ? shoreInk : const Color(0xFF64748B),
              size: 21));

  Drawer _drawer(BuildContext context) => Drawer(
          child: SafeArea(
              child: ListView(padding: const EdgeInsets.all(16), children: [
        Image.asset('assets/images/slcg_logo.png',
            height: 48, alignment: Alignment.centerLeft),
        const Divider(height: 36),
        ListTile(
            leading: const Icon(Icons.home_outlined),
            title: const Text('Home'),
            onTap: () => Navigator.pushNamedAndRemoveUntil(
                context, '/shore_dashboard', (_) => false)),
        ListTile(
            leading: const Icon(Icons.directions_boat_outlined),
            title: const Text('Trips'),
            onTap: () => Navigator.pushNamed(context, '/trips_list')),
        ListTile(
            leading: const Icon(Icons.notifications_none),
            title: const Text('Notifications'),
            onTap: () => Navigator.pushNamed(context, '/shore_notifications')),
        ListTile(
            leading: const Icon(Icons.settings_outlined),
            title: const Text('Settings'),
            onTap: () => Navigator.pushNamed(context, '/shore_settings')),
        const Divider(),
        ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Log Out', style: TextStyle(color: Colors.red)),
            onTap: () => _logout(context)),
      ])));

  Future<void> _logout(BuildContext context) async {
    await ApiService.instance.logout();
    if (context.mounted)
      Navigator.pushNamedAndRemoveUntil(context, '/login', (_) => false);
  }
}
