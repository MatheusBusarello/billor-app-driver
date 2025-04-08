import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { subscribeToChat, sendMessage } from "../../libs/firebase/services/chatServices";
import { auth } from "../../config/firebase";
import { Header } from "../../components/Header";

export function Support() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userAvatar, setUserAvatar] = useState(auth.currentUser?.photoURL);
  const flatListRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToChat(setMessages);
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      auth.currentUser?.reload().then(() => {
        setUserAvatar(auth.currentUser?.photoURL);
      });
    }, [])
  );

  const handleSend = () => {
    if (inputText.trim() === '') return;
    sendMessage(inputText);
    setInputText('');
  };

  const renderAvatar = (user) => {
    const isCurrentUser = user._id === auth.currentUser?.uid;
    const avatarToShow = isCurrentUser ? userAvatar : user.avatar;

    if (!avatarToShow) return null;

    return (
      <Image 
        source={{ uri: avatarToShow }} 
        style={styles.avatar} 
      />
    );
  };

  const renderItem = ({ item }) => {
    if (!item?.user || !item?._id || !item?.text) return null;
    const isCurrentUser = item.user._id === auth.currentUser?.uid;

    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
      ]}>
        {!isCurrentUser && renderAvatar(item.user)}
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
        ]}>
          {!isCurrentUser && (
            <Text style={styles.userName}>{item.user.name}</Text>
          )}
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {isCurrentUser && renderAvatar(item.user)}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Header title="Support" />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() => 
          messages.length > 0 && flatListRef.current.scrollToEnd({ animated: false })
        }
        onLayout={() => 
          messages.length > 0 && flatListRef.current.scrollToEnd({ animated: false })
        }
        inverted={true}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="What is your doubt?"
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSend}
          disabled={inputText.trim() === ''}
        >
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  messageList: { flex: 1 },
  messageListContent: { paddingVertical: 10, paddingHorizontal: 10 },
  messageContainer: { flexDirection: 'row', marginVertical: 5, alignItems: 'flex-end' },
  currentUserContainer: { justifyContent: 'flex-end' },
  otherUserContainer: { justifyContent: 'flex-start' },
  avatar: { width: 34, height: 34, borderRadius: 17, marginHorizontal: 5 },
  messageBubble: { padding: 10, borderRadius: 12, maxWidth: '70%' },
  currentUserBubble: { backgroundColor: '#DCF8C6' },
  otherUserBubble: { backgroundColor: '#FFFFFF' },
  userName: { fontWeight: 'bold', fontSize: 12, marginBottom: 3, color: '#666' },
  messageText: { fontSize: 16 },
  timestamp: { fontSize: 10, color: '#999', alignSelf: 'flex-end', marginTop: 4 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#DDD', backgroundColor: '#FFF' },
  input: { flex: 1, backgroundColor: '#F0F0F0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100 },
  sendButton: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#007BFF', borderRadius: 20, paddingHorizontal: 15, marginLeft: 10 },
  sendButtonText: { color: '#FFFFFF', fontWeight: 'bold' }
});
