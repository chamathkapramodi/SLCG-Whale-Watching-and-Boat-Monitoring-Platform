import 'dart:convert';
import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:signalr_netcore/signalr_client.dart';

class Session {
  final String accessToken, refreshToken;
  final List<String> roles;
  const Session(this.accessToken, this.refreshToken, this.roles);
}

class ApiService extends ChangeNotifier {
  ApiService._();
  static final instance = ApiService._();
  static const _storage = FlutterSecureStorage();
  static const baseUrl = String.fromEnvironment('API_BASE_URL',
      defaultValue: 'http://localhost:8080');
  Session? session;
  HubConnection? _hub;
  String? get role =>
      session?.roles.isNotEmpty == true ? session!.roles.first : null;

  Future<String?> restore() async {
    final refresh = await _storage.read(key: 'refresh_token');
    if (refresh == null) return null;
    try {
      final data = await _post('/api/auth/refresh', {'refreshToken': refresh},
          authenticated: false);
      await _setSession(data);
      return role;
    } catch (_) {
      await logout();
      return null;
    }
  }

  Future<String> login(String email, String password) async {
    final data = await _post(
        '/api/auth/login', {'email': email, 'password': password},
        authenticated: false);
    await _setSession(data);
    return role!;
  }

  Future<void> logout() async {
    session = null;
    await _storage.delete(key: 'refresh_token');
    await _hub?.stop();
    notifyListeners();
  }

  Future<List<Map<String, dynamic>>> trips() async =>
      (await _get('/api/operations/trips') as List)
          .cast<Map<String, dynamic>>();
  Future<List<Map<String, dynamic>>> boats() async =>
      (await _get('/api/operations/boats') as List)
          .cast<Map<String, dynamic>>();
  Future<List<Map<String, dynamic>>> tripPassengers(String tripId) async =>
      (await _get('/api/operations/trips/$tripId/passengers?updated=${DateTime.now().millisecondsSinceEpoch}')
              as List)
          .cast<Map<String, dynamic>>();
  Future<void> refreshData() async {
    await trips();
    notifyListeners();
  }

  Future<void> approve(String id, String approval) async => _send('PATCH',
      '/api/operations/trips/$id/shore-approval', {'approval': approval});
  Future<void> updateStatus(String id, String status) async =>
      _send('PATCH', '/api/operations/trips/$id/status', {'status': status});
  Future<void> createTrip(String boatId, DateTime departure,
          {String route = 'Mirissa – Dondra Head',
          int passengerCount = 0}) async =>
      _send('POST', '/api/operations/trips', {
        'boatId': boatId,
        'scheduledDepartureUtc': departure.toUtc().toIso8601String(),
        'route': route,
        'passengerCount': passengerCount
      });
  Future<void> createBoat(
          {required String name,
          required String registrationNumber,
          required String hullNumber,
          required double length,
          required double width,
          required int capacity}) async =>
      _send('POST', '/api/operations/boats', {
        'name': name,
        'registrationNumber': registrationNumber,
        'registrationDate': DateTime.now().toIso8601String().substring(0, 10),
        'hullNumber': hullNumber,
        'lengthMeters': length,
        'widthMeters': width,
        'maximumCapacity': capacity
      });

  Future<void> _setSession(Map<String, dynamic> data) async {
    session = Session(data['accessToken'], data['refreshToken'],
        List<String>.from(data['roles']));
    await _storage.write(key: 'refresh_token', value: session!.refreshToken);
    notifyListeners();
    unawaited(_connect());
  }

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (session != null) 'Authorization': 'Bearer ${session!.accessToken}'
      };
  Future<dynamic> _get(String path) async {
    final r = await http
        .get(Uri.parse('$baseUrl$path'), headers: _headers)
        .timeout(const Duration(seconds: 10));
    return _decode(r);
  }

  Future<Map<String, dynamic>> _post(String path, Object body,
      {bool authenticated = true}) async {
    try {
      final r = await http
          .post(Uri.parse('$baseUrl$path'),
              headers: authenticated
                  ? _headers
                  : {'Content-Type': 'application/json'},
              body: jsonEncode(body))
          .timeout(const Duration(seconds: 10));
      return (_decode(r) as Map).cast<String, dynamic>();
    } on TimeoutException {
      throw Exception(
          'Cannot reach the WWMS API at $baseUrl. Confirm that the backend is running.');
    } on http.ClientException {
      throw Exception(
          'Cannot reach the WWMS API at $baseUrl. Confirm that the backend is running.');
    }
  }

  Future<void> _send(String method, String path, Object body) async {
    final req = http.Request(method, Uri.parse('$baseUrl$path'))
      ..headers.addAll(_headers)
      ..body = jsonEncode(body);
    final streamed = await req.send();
    if (streamed.statusCode < 200 || streamed.statusCode >= 300)
      throw Exception('Request failed (${streamed.statusCode})');
  }

  dynamic _decode(http.Response r) {
    if (r.statusCode < 200 || r.statusCode >= 300)
      throw Exception(r.statusCode == 401
          ? 'Invalid email or password.'
          : 'Request failed (${r.statusCode})');
    return r.body.isEmpty ? null : jsonDecode(r.body);
  }

  Future<void> _connect() async {
    await _hub?.stop();
    _hub = HubConnectionBuilder()
        .withUrl('$baseUrl/hubs/operations',
            options: HttpConnectionOptions(
                accessTokenFactory: () => Future.value(session!.accessToken)))
        .withAutomaticReconnect()
        .build();
    _hub!.on('operationsChanged', (_) => notifyListeners());
    try {
      await _hub!.start();
    } catch (e) {
      debugPrint('Realtime unavailable: $e');
    }
  }
}
