import React, {FC, useState, useEffect} from 'react';
import {StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Modal, TextInput, Animated} from 'react-native';
import todoList from '../api/todoList.json';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {EvilIcons} from '@expo/vector-icons';
import {Feather} from '@expo/vector-icons';


type Todo = {
  id: number;
  todo: string;
  done: boolean;
}

type Mode = 'list' | 'add';

const HomeScreen: FC = () => {
  const [ready, setReady] = useState(false);
  const getReady = () => {
    setTodos(todoList);
    setReady(true);
  }

  useEffect(() => {
    getReady();
  }, []);

  const [mode, setMode] = useState<Mode>('list');
  const changeMode = (mode: Mode) => {
    setMode(mode);
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const addTodo = (todo: Todo) => {
    setTodos(todos => [...todos, todo]);
  }

  const handleAdd = () => {
    if (!title || !description) return;

    const newTodo: Todo = {
      id: setTodos.length === 0 ? 1 : todos[todos.length - 1].id + 1,
      title,
      description,
      done: false
    }
    addTodo(newTodo);
    changeMode('list');
  }

  useEffect(() => {

  }, [todos]);

  const deleteTodo = (id: number) => {
    setTodos(todos => todos.filter(todo => todo.id !== id));
  }

  const handleDelete = (id: number) => {
    deleteTodo(id);
  }

  const rightActions = (id: number) => {
    return (
      <TouchableOpacity
        onPress={() => handleDelete(id)}
        style={{}}
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

  const changeTodoState = (id: number) => {
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

  return (
    <>
      <SafeAreaView　style={styles.container}>
        <View>
          <Text style={styles.plus}>
            just MEMO ...
          </Text>
        </View>
        <View style={styles.todo_wrapper}>
          <FlatList
            data={todos}
            renderItem={({item: todo}) => {
              return (
                <Swipeable
                  renderRightActions={() => rightActions(todo.id)}
                  friction={3}
                >
                  <View style={styles.todo_container}>
                    <TouchableOpacity onPress={() => changeTodoState(todo.id)}>
                      {!todo.done
                        ? <Feather name="square" size={30} color="white" />
                        : <Feather name="check-square" size={30} color="white" />
                      }
                    </TouchableOpacity>
                    <View style={styles.todo_Wrapper}>
                      <Text numberOfLines={2} style={styles.todo_title}>
                        {todo.todo}
                      </Text>
                    </View>
                  </View>
                </Swipeable>
              );
            }}
            keyExtractor={(_, index) => index.toString()}
          >
          </FlatList>
        </View>
        <TouchableOpacity style={{flex: 1, margin: 15}}>
          <EvilIcons name="plus" size={40} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(28, 28, 30)',
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
    fontSize: 20,
    fontFamily: 'Hiragino Sans',
    textAlign: 'center',
    color: '#4169e1',
    fontWeight: 'bold',
    marginTop: 15,
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
});

export default HomeScreen;
