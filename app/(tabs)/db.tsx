import { useState } from 'react'
import { Alert, Button, Text, TextInput, View } from 'react-native'
import { supabase } from '../../lib/supabase'

export default function TestScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  async function signUp() {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) Alert.alert('Error', error.message)
    else setStatus(`Signed up! User id: ${data.user?.id}`)
  }

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) Alert.alert('Error', error.message)
    else setStatus(`Logged in as ${data.user?.email}`)
  }

  async function addEntry() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Alert.alert('Not logged in')
    
    const { error } = await supabase
      .from('entries')
      .insert({ user_id: user.id, content: 'Hello from my app!', title: 'Test entry' })
    
    if (error) Alert.alert('Error', error.message)
    else setStatus('Entry saved!')
  }

  async function readEntries() {
    const { data, error } = await supabase.from('entries').select('*')
    if (error) Alert.alert('Error', error.message)
    else setStatus(`Found ${data.length} entries: ${JSON.stringify(data, null, 2)}`)
  }

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, padding: 8 }} />
      <Button title="Sign up" onPress={signUp} />
      <Button title="Sign in" onPress={signIn} />
      <Button title="Add test entry" onPress={addEntry} />
      <Button title="Read my entries" onPress={readEntries} />
      <Text>{status}</Text>
    </View>
  )
}