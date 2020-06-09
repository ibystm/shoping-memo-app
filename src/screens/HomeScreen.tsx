import React, {FC, useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, TextInput, Animated, Button, KeyboardAvoidingView, ActionSheetIOS, Keyboard,} from 'react-native';
import todoList from '../api/todoList.json';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Feather} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {ScrollView, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import AddTodoScreeen from './AddTodoScreen';

type Todo = {
  id: number;
  todo: string;
  done: boolean;
}

const HomeScreen: FC = () => {
  // const [ready, setReady] = useState(false);
  // const getReady = () => {
  //   setTodos(todoList);
  //   setReady(true);
  // }

  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');

  // useEffect(() => {
  //   getReady();
  //   // console.warn(text);
  // }, []);

  
  const [todos, setTodos] = useState<Todo[]>([]);
  const addTodo = (todo: Todo) => {

    setTodos(todos => [...todos, todo]);
  }

  const handleAdd = () => {
    const newId: number = extractMaxId(todos);

    const newTodo: Todo = {
      id: newId,
      todo: text,
      done: false,
    }


    console.log('newTodo####', newTodo.id);

    if (newTodo.todo.length > 0) {
      setTodos(todos => [...todos, newTodo]);
    }
    setText('');
    setModalVisible(false);
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
    setModalVisible(true)
  }

  const onPressBackDrop = () => {
    Keyboard.dismiss();
    setModalVisible(false);
  }

  const renderItem = ({item}: {item: Todo}) => {

    return (
      <Swipeable
        renderRightActions={() => rightActions(item.id)}
        friction={2}
        overshootRight={false}
      >
        <View style={styles.todo_container}>
          <TouchableOpacity onPress={() => changeTodoState(item.id)}>
            {item.done
              ? <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={30} color="white" />
              : <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={30} color="white" />}
          </TouchableOpacity>
          <Text
            numberOfLines={1}
            style={{
              width: '90%',
              textAlignVertical: 'center',
              fontSize: 15,
              marginLeft: 15,
              lineHeight: 20,
              color: item.done ? '#C5C8C9' : '#fff',
              textDecorationLine: item.done ? 'line-through' : 'none',
            }}>
              {item.todo}
            </Text>
        </View>
      </Swipeable>
    );
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
        <FlatList
          data={todos}
          renderItem={todo => renderItem(todo)}
          keyExtractor={item => item.todo}
        >
        </FlatList>
      </View>
      <TouchableOpacity
        onPress={onPressAddTodo}
        style={{
        position: 'absolute',
        bottom: 40,
        right: 30,
        }}>
        <AntDesign name="pluscircle" size={60} color="#2A77CC" />
      </TouchableOpacity>
      <Modal
        isVisible={modalVisible}
        swipeDirection='down'
        backdropOpacity={0.3}
        onBackdropPress={onPressBackDrop}
        style={{
          justifyContent: 'flex-end',
        }}
      >
        <KeyboardAvoidingView behavior="padding">
          <View style={{
            backgroundColor: 'rgb(44, 44, 46)',
            borderRadius: 10,
            alignItems: 'center',
          }}>
            <TextInput
              autoFocus={true}
              keyboardAppearance={'default'}
              numberOfLines={1}
              returnKeyType={"done"}
              onChangeText={e => setText(e)}
              value={text}
              placeholder="Ex. Apple"
              placeholderTextColor='#215ea2'
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
    backgroundColor: 'rgb(28, 28, 30)',
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
    marginTop: 25,
    width: '100%',
    // height: '100%',
  },
  todo_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
    paddingLeft: 15,
    backgroundColor: 'rgb(44, 44, 46)',
    width: '100%',
    height: 60,
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
    backgroundColor: '#dc143c',
    justifyContent: 'center',
    paddingRight: 25,
  },
  delete: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Hiragino Sans',
    textAlign: 'center',
  },
  todo_Wrapper: {
    width: '80%',
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
    backgroundColor: 'red',
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
    borderBottomColor: '#131314',
    borderBottomWidth: 1,
    width: '60%',
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
});

export default HomeScreen;
