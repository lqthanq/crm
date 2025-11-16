import { EntityManager, EventSubscriber } from 'typeorm';
import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.sunscriber';
import { OrganizationProject } from './organization-project.entity';

@EventSubscriber()
export class OrganizationProjectSubscriber extends BaseEntityEventSubscriber<OrganizationProject> {
    listenTo() {
        return OrganizationProject;
    }

    async afterEntityCreate(entity: OrganizationProject, em?: EntityManager): Promise<void> {
        try {
            await this.updateProjectMembersCount(entity, em!);
        } catch (error) {
            console.error(
                'OrganizationProjectSubscriber: An error occurred during the afterEntityCreate process:',
                error.message,
            );
        }
    }

    /**
     * Updates the members count of an OrganizationProject entity
     *
     * @param entity
     * @param em
     * @returns
     */
    async updateProjectMembersCount(entity: OrganizationProject, em?: EntityManager): Promise<void> {
        try {
            if (!em) {
                return;
            }

            const { organizationId, tenantId, id: projectId } = entity;

            const query = `
                SELECT COUNT(*) AS count FROM organization_project_employee
                INNER JOIN organization_project ON "organization_project"."id" = "organization_project_employee"."organizationProjectId"
                WHERE 
                    "organization_project_employee"."organizationProjectId" = $1 AND
                    "organization_project"."organizationId" = $2 AND
                    "organization_project"."tenantId" = $3
            `;

            let updateQuery = `UPDATE "organization_project" SET "membersCount" = $1 WHERE "id" = $2 AND "organizationId" = $3 AND "tenantId" = $4`;

            let totalMembers = 0;

            // Handle
            const result = await em.query(query, [projectId, organizationId, tenantId]);
            totalMembers = parseInt(result[0]?.count ?? 0, 10);

            // Update members count
            if (totalMembers > 0) {
                await em.query(updateQuery, [totalMembers, projectId, organizationId, tenantId]);
            }
        } catch (error) {
            console.error(
                'OrganizationProjectSubscriber: An error occurred during the updateProjectMembersCount process:',
                error,
            );
        }
    }
}
