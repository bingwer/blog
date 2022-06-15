import Swal, { SweetAlertOptions } from 'sweetalert2';

/* eslint-disable import/prefer-default-export */
export function cls(...classnames: string[]) {
  return classnames.join(' ');
}

export const makeAlert = async (
  message: { title?: string; content?: string },
  flag: 'success' | 'error',
  darkMode: boolean,
  etc?: SweetAlertOptions,
) => {
  return Swal.fire({
    icon: flag,
    ...(message.title && { title: message.title }),
    ...(message.content && { text: message.content }),
    showConfirmButton: false,
    timer: 1500,
    color: darkMode ? 'white' : '#312f3a',
    background: darkMode ? '#1B262C' : '#F9F7F7',
    ...etc,
  }).catch(e => {
    return e;
  });
};

export const makeConfirmAlert = async (
  message: {
    title?: string;
    content?: string;
  },
  darkMode: boolean,
) => {
  return Swal.fire({
    ...(message.title && { title: message.title }),
    ...(message.content && { text: message.content }),
    icon: 'question',
    showCancelButton: true,
    color: darkMode ? 'white' : '#312f3a',
    background: darkMode ? '#1B262C' : '#F9F7F7',
    confirmButtonColor: darkMode ? '#0F4C75' : '#398AB9',
  })
    .then(result => {
      return result.isConfirmed;
    })
    .catch(e => {
      return e;
    });
};
