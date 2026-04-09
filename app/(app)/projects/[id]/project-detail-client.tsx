'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { ProjectWithRelations, TeamRole } from '@/lib/types'
import { ProjectDetailHeader } from '@/components/projects/project-detail-header'
import { ProjectSidebar } from '@/components/projects/project-sidebar'
import { ActivityLog } from '@/components/projects/activity-log'
import { updateProject } from '@/lib/actions/projects'

interface ProjectDetailClientProps {
  project: ProjectWithRelations
  userRole: TeamRole
}

export function ProjectDetailClient({ project, userRole }: ProjectDetailClientProps) {
  const router = useRouter()

  async function handleTitleUpdate(title: string) {
    const result = await updateProject(project.id, { title })
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Title updated')
      router.refresh()
    }
  }

  return (
    <>
      <ProjectDetailHeader project={project} onTitleUpdate={handleTitleUpdate} />

      <div className="flex gap-6 px-6 py-6">
        {/* Main content area */}
        <div className="flex-1 min-w-0">
          <ActivityLog key={project.status} projectId={project.id} />
        </div>

        {/* Right sidebar */}
        <ProjectSidebar project={project} userRole={userRole} />
      </div>
    </>
  )
}
