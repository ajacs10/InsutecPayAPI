import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#007bff',
  secondary: '#666',
  gray: '#888',
  background: '#f5f5f5',
  white: '#fff',
  black: '#000',
};

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: COLORS.background,
  },
  logo: {
    width: 170,
    height: 150,
    borderRadius: 10,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 7,
    textAlign: 'center',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 60,
    textAlign: 'center',
    color: COLORS.secondary,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    width: '50%',
    marginTop: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
},

  buttonDisabled: {
    backgroundColor: '#a0c0ff',
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  forgotPasswordButton: {
    marginTop: 20,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  info: {
    marginTop: 80,
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 14,
  },
});

