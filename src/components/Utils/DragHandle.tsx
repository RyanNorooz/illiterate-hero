import type { useSortable } from '@dnd-kit/sortable'
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material'
import { Collapse, IconButton, type CollapseProps, type IconButtonProps } from '@mui/material'

interface DragHandleProps {
  show: boolean
  dnd: Partial<ReturnType<typeof useSortable>> & { isDragOverlay?: boolean }
  slotProps?: {
    collapse?: CollapseProps
    iconButton?: IconButtonProps
  }
}

export default function DragHandle(props: DragHandleProps) {
  return (
    <Collapse
      orientation="horizontal"
      in={props.dnd?.isDragOverlay || props.show}
      unmountOnExit
      appear={!props.dnd?.isDragOverlay}
      {...props.slotProps?.collapse}
    >
      <IconButton
        aria-label="drag handle"
        disableRipple
        {...props.dnd?.listeners}
        {...props.slotProps?.iconButton}
        sx={{
          cursor: props.dnd?.isDragging || props.dnd?.isDragOverlay ? 'grabbing' : 'grab',
          ...props.slotProps?.iconButton?.sx,
        }}
      >
        <DragIndicatorIcon />
      </IconButton>
    </Collapse>
  )
}
