import { MoreVert as MoreVertIcon } from '@mui/icons-material'
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem as MuiMenuItem,
} from '@mui/material'
import React from 'react'
import { useId, useState } from 'react'
import { z } from 'zod'

interface OptionsMenuItem {
  text: string | React.ReactNode
  icon?: React.ReactNode
  cb?: () => void
  inset?: boolean
}

function OptionsMenuItem(props: OptionsMenuItem) {
  return (
    <MuiMenuItem dense onClick={props.cb}>
      <ListItemIcon>{props.icon}</ListItemIcon>
      <ListItemText inset={props.inset}>{props.text}</ListItemText>
    </MuiMenuItem>
  )
}

interface OptionsMenuProps {
  items: OptionsMenuItem[] | OptionsMenuItem[][]
}

export default function OptionsMenu(props: OptionsMenuProps) {
  const id = useId()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const isGrouped = <T,>(arr: T[] | T[][]): arr is T[][] => arr.every((i) => Array.isArray(i))

  return (
    <>
      <IconButton
        aria-label={`options-menu-${id}`}
        id={`options-menu-btn-${id}`}
        aria-controls={open ? `options-menu-${id}` : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon fontSize="large" />
      </IconButton>
      <Menu
        id={`options-menu-${id}`}
        MenuListProps={{ 'aria-labelledby': `options-menu-btn-${id}` }}
        anchorEl={anchorEl}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={open}
        onClose={handleClose}
        slotProps={{ paper: { sx: { maxHeight: 32 * 6, width: '35ch', borderRadius: 3 } } }}
      >
        {/* {props.items.map((item, index) =>  (
          <MuiMenuItem key={index} dense onClick={item.cb}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText inset={item.inset}>{item.text}</ListItemText>
          </MuiMenuItem>
        ))} */}

        {isGrouped(props.items)
          ? props.items.map((group, index) => [
              group.map((item, iIndex) => <OptionsMenuItem key={iIndex} {...item} />),
              index !== props.items.length - 1 && <Divider />,
            ])
          : props.items.map((item, index) => <OptionsMenuItem key={index} {...item} />)}
      </Menu>
    </>
  )
}
