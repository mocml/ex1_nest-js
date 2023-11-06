export const slashPath = (_path?: string) => {
  return (_slash?: string) => {
    return _slash ? `/${_path}/${_slash}` : `/${_path}`
  }
}

