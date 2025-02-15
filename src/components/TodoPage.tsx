import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskName, setEditedTaskName] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  // Fetch tasks from the API
  const handleFetchTasks = async () => {
    const fetchedTasks = await api.get('/tasks');
    setTasks(fetchedTasks);
  };

  // Handle task deletion
  const handleDelete = async (id: number) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.ok) {
        // Refresh the tasks after deletion
        handleFetchTasks();
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle task saving (updating the task)
  const handleSave = async (id: number) => {
    if (editedTaskName === '') return; // Ensure task name is not empty

    try {
      const response = await api.put(`/tasks/${id}`, { name: editedTaskName });
      if (response.ok) {
        // Refresh tasks after saving the updated task
        handleFetchTasks();
        setEditingTaskId(null); // Exit editing mode
      } else {
        console.error('Failed to save task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Check if the task name has changed to enable the save button
  const handleTaskNameChange = (id: number, newName: string) => {
    setEditedTaskName(newName);
    setButtonDisabled(newName === tasks.find((task) => task.id === id)?.name);
    setEditingTaskId(id); // Set task ID to indicate which task is being edited
  };

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks.map((task) => (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%" key={task.id}>
              <TextField
                size="small"
                value={editingTaskId === task.id ? editedTaskName : task.name}
                fullWidth
                sx={{ maxWidth: 350 }}
                onChange={(e) => handleTaskNameChange(task.id, e.target.value)}
                disabled={editingTaskId !== task.id}
              />
              <Box>
                <IconButton
                  color="success"
                  disabled={editingTaskId !== task.id || buttonDisabled} // Disable save if no changes
                  onClick={() => handleSave(task.id)}
                >
                  <Check />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(task.id)} // Delete task on button click
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        }

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button variant="outlined" onClick={() => {}}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default TodoPage;
