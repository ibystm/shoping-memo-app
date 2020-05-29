import React, {FC, useState, useEffect} from 'react';
import {StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Modal, TextInput} from 'react-native';
import todoList from './src/api/todoList.json';


type Todo = {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

type Mode = 'list' | 'add';

const App: FC = () => {
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

  const handlePlus = () => {
    changeMode('add');
  }

  const handleCancel = () => {
    changeMode('list');
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


  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');


  const resetInput = () => {
    setTitle('')
    setDescription('');
  }

  useEffect(() => {
    if (mode === 'list') {
      resetInput();
    }
  }, [mode]);

  const deleteTodo = (id: number) => {
    setTodos(todos => todos.filter(todo => todo.id !== id));
  }

  const handleDelete = (id: number) => {
    deleteTodo(id);
  }

  return (
    <>
      <SafeAreaView　style={styles.container}>
        <View>
          <TouchableOpacity onPress={() => handlePlus()}>
            <Text style={styles.plus}>
              + TODO ADD
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.todo_wrapper}>
          <FlatList
            data={todos}
            renderItem={({item: todo}) => {
              return (
                <View style={styles.todo_container}>
                  <View style={styles.todo_Wrapper}>
                    <Text numberOfLines={2} style={styles.todo_title}>
                      {todo.title}: {todo.description}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(todo.id)}
                    style={styles.deleteWrapper}
                  >
                    <Text style={styles.delete}>Delete</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={(_, index) => index.toString()}
          >
          </FlatList>
        </View>
      </SafeAreaView>
      <Modal visible={mode ==='add'} animationType={'slide'}>
        <View style={styles.modal}>
          <View style={styles.textinput_frame}>
            <TextInput
              placeholder={'Title'}
              value={title}
              onChangeText={text => setTitle(text)}
              style={styles.textinput}
            />
            <TextInput
              placeholder={'Description'}
              value={description}
              onChangeText={text => setDescription(text)}
              style={styles.textinput}
            />
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={() => handleAdd()}>
              <Text style={styles.add}>ADD</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCancel()}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  todo_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
    paddingLeft: 15,
    backgroundColor: '#f5f5f5',
    width: '100%',
    height: 60,
  },
  todo_title: {
    width: '85%',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'left',
    fontFamily: "Hiragino Sans",
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
});

export default App;
