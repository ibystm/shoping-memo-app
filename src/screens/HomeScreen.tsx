import React, {FC, useState, useEffect, useRef, useCallback} from 'react';
import {StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, TextInput, Animated, Button, KeyboardAvoidingView, ActionSheetIOS, Keyboard} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Feather} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import {AsyncStorage} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist'
import * as Haptics from 'expo-haptics';

type Todo = {
  id: number;
  todo: string;
  done: boolean;
}

const HomeScreen: FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      const allItemKeys = await AsyncStorage.getAllKeys();

      console.log('#######allItemKeys', allItemKeys);
      if (allItemKeys.length> 0) {
        const allStorageItem = await AsyncStorage.multiGet(allItemKeys);
        allStorageItem.map(async item => {
          const id = Number(item[0]);
          // すでにtodosの中に要素が1つでも存在しているかどうか
          const isAdded = todos.some(todo => todo.id == id);
          if (!isAdded) {
            console.log('isAddedの結果は', isAdded);

            const todo = JSON.parse(item[1]);
            setTodos(todos => [...todos, todo]);
            console.log('####このtodoを追加しｔました　', todo);
          }
        });
      }
    }
    loadItems();

  }, []);

  const handleAdd = () => {
    const newId: number = extractMaxId(todos);
    const newTodo: Todo = {
      id: newId,
      todo: text,
      done: false,
    }

    if (newTodo.todo.length > 0) {
      setTodos(todos => [newTodo, ...todos]);
    }
    setText('');
    // setModalVisible(false);
    storeTodo(newTodo);
  }

  const extractMaxId = (todos: Todo[]): number => {
    if (todos.length > 0) {
      // todos　Arrayの中で最大のidを返す
      const id = Math.max.apply(null, todos.map(todo => todo.id));
      return id + 1;
    }

    const firstNumberingId = 0;
    return firstNumberingId;
  }

  const deleteTodo = (id: number) => {
    setTodos(todos => todos.filter(todo => todo.id !== id));
    const stringId = id.toString();
    AsyncStorage.removeItem(stringId);
  }

  const delteAllTodo = () => {
    if (todos.length > 0) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          message: 'すべてのリストを削除してもよろしいですか？',
          options: ['キャンセル', '削除'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            const newTodo = [...todos];
            newTodo.splice(0)
            setTodos(newTodo);      
          }
        }
      );
      AsyncStorage.clear();
    }
  }

  const handleDelete = (id: number) => {
    deleteTodo(id);
  }

  const changeTodoState = (id: number) => {
    // なぜか引数のidがINfinityになっている
    console.log('idは#######', id);

    const todo = todos.find(todo => todo.id === id);
    // doneのとき
    if (todo && todo.done) {
      todo.done = false;
      setTodos([...todos]);

      // doneじゃないとき
    } else if (todo && !todo.done) {
      todo.done = true;
      setTodos([...todos]);
    }
  }

  const rightActions = (id: number) => {
    return (
      <TouchableOpacity
        onPress={() => handleDelete(id)}
        >
        <View style={styles.swipeDelete}>
          <Animated.Text
            style={{
              color: '#fff',
              fontFamily: "Hiragino Sans",
              padding: 20,
            }}
          >
          Delete
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  }

  const onPressAddTodo = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setModalVisible(true)
  }

  const onPressBackDrop = () => {
    Keyboard.dismiss();
    setModalVisible(false);
  }

  const renderItem = (
    {
      item,
      index,
      drag,
      isActive
    }: {
        item: Todo,
        index: number,
        drag: () => void,
        isActive: boolean
    }): React.ReactNode => {
    return (
      <Swipeable
        renderRightActions={() => rightActions(item.id)}
        friction={2}
        overshootRight={false}
      >
        <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 1,
              paddingLeft: 15,
              backgroundColor: '#2c2c2e',
              width: '100%',
              height: isActive ? 70 : 55,
        }}>
          <TouchableOpacity onPress={() => changeTodoState(item.id)}>
            {item.done
              ? <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={30} color="white" />
              : <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={30} color="white" />}
          </TouchableOpacity>
          <TouchableOpacity
            onLongPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              drag()
            }}
            // onPressOut={moveEnd}
            style={{
            marginLeft: 15,
            width: '85%',
          }}>
            <Text
              numberOfLines={1}
              style={{
                textAlignVertical: 'center',
                fontSize: isActive ? 17: 15,
                lineHeight: 20,
                color: item.done ? '#C5C8C9' : '#fff',
                textDecorationLine: item.done ? 'line-through' : 'none',
              }}>
                {item.todo}
              </Text>
          </TouchableOpacity>
        </View>
     </Swipeable>
    );
  }

  const storeTodo = async (todo: Todo) => {
    const strinId = todo.id.toString();
    const todoToString = JSON.stringify(todo);
    console.log(strinId, todoToString);

    try{
      await AsyncStorage.setItem(strinId, todoToString);
      const allItemKeys = await AsyncStorage.getAllKeys();
      console.log('#######allItemKeys', allItemKeys);

    }catch(e){
      console.log(e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleArea}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.plus}>
            memo
          </Text>
        </View>
        <TouchableOpacity style={{position: 'absolute', right: 20}} onPress={delteAllTodo}>
          <Feather name="trash-2" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.todo_wrapper}>
        <DraggableFlatList
          data={todos}
          // @ts-ignore
          renderItem={renderItem}
          keyExtractor={item => item.todo}
          onDragEnd={({data}) => setTodos(data)}
        />
      </View>
      <TouchableOpacity
        onPress={onPressAddTodo}
        style={styles.addButtonFloat}>
        <AntDesign name="pluscircle" size={60} color="#2A77CC" />
      </TouchableOpacity>
      <Modal
        isVisible={modalVisible}
        swipeDirection='down'
        backdropOpacity={0.2}
        onBackdropPress={onPressBackDrop}
        style={{
          justifyContent: 'flex-end',
        }}
      >
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.modalContainer}>
            <TextInput
              autoFocus={true}
              keyboardAppearance={'default'}
              numberOfLines={1}
              returnKeyType={"done"}
              onChangeText={e => setText(e)}
              value={text}
              placeholderTextColor='#215ea2'
              enablesReturnKeyAutomatically={true}
              style={styles.modalTextInput}
            >
            </TextInput>
            <TouchableOpacity
              onPress={handleAdd}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>ADD TODO</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  titleArea: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
  },
  modal: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: "#fff", 
    height: 400,
  },
  todo_wrapper: {
    flex: 1,
    marginTop: 25,
    width: '100%',
    height: '100%',
  },
  todo_title: {
    width: '85%',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'left',
    fontFamily: "Hiragino Sans",
    color: '#fff',
  },
  deleteWrapper: {
    width: '30%',
    height: '100%',
    backgroundColor: '#F44236',
    justifyContent: 'center',
    paddingRight: 25,
  },
  delete: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Hiragino Sans',
    textAlign: 'center',
  },
  plus: {
    fontSize: 23,
    fontFamily: 'Helvetica Neue',
    textAlign: 'center',
    color: '#2A77CC',
    fontWeight: 'bold',
    paddingLeft: 15,
  },
  add: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
    width: 250,
    marginTop: 20,
    marginRight: 5,
    padding: 10,
    backgroundColor: '#4169e1',
  },
  cancel: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
    width: '100%',
    marginTop: 20,
    marginLeft: 5,
    padding: 10,
    backgroundColor: '#ccc',
  },
  addButtonFloat: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    },
  textinput_frame: {
    width: '100%',
    marginBottom: 25,
  },
  textinput: {
    fontSize: 18,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    padding: 25,
  },
  button: {
    flexDirection: 'row',
  },
  swipeDelete: {
    backgroundColor: '#F44236',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '98%',
  },
  modalTextInput: {
    paddingTop: 20,
    paddingHorizontal: 20,
    color: '#2A77CC',
    fontSize: 20,
    paddingBottom: 3,
    fontFamily: 'Helvetica Neue',
    borderBottomColor: '#131314',
    borderBottomWidth: 1,
    width: '70%',
    textAlign: 'center',
  },
  addButton: {
    width: '80%',
    height: 40,
    backgroundColor: '#2A77CC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  addButtonText: {
    // alignSelf: 'center',
    color: '#091829',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'rgb(44, 44, 46)',
    borderRadius: 10,
    alignItems: 'center',
  }
});

export default HomeScreen;
