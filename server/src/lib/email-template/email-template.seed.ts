import * as path from 'path';
import * as fs from 'fs';
import mjml2html from 'mjml';
import { DataSource } from 'typeorm';
import { EmailTemplate } from './email-template.entity';

export const createDefaultEmailTemplates = async (dataSource: DataSource) => {
    try {
        const templatePath = ['core', 'seeds', 'data', 'default-email-templates'];

        const files = [];

        let FOLDER_PATH = path.join(__dirname, '../../', ...templatePath);

        FOLDER_PATH = fs.existsSync(FOLDER_PATH) ? FOLDER_PATH : path.resolve('.', 'src/lib', ...templatePath);

        findInDir(FOLDER_PATH, files);
        await fileToTemplate(dataSource, files);
    } catch (error) {
        console.error(error);
    }
};

function findInDir(dir: string, fileList: string[] = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const fileStat = fs.lstatSync(filePath);

        if (fileStat.isDirectory()) {
            findInDir(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });
}

const fileToTemplate = async (dataSource: DataSource, files: string[]) => {
    for (const file of files) {
        const template = await pathToEmailTemplate(file);

        if (template && template.hbs) {
            await insertTemplate(dataSource, template);
        }
    }
};

const pathToEmailTemplate = async (fullPath: string): Promise<EmailTemplate | undefined> => {
    try {
        const template = new EmailTemplate();
        const templatePath = fullPath.replace(/\\/g, '/').split('/');
        const fileName = templatePath[templatePath.length - 1].split('.', 2);
        const fileExtension = fileName[1];
        const fileNameWithoutExtension = fileName[0];

        template.language_code = templatePath[templatePath.length - 2];

        template.name = `${templatePath[templatePath.length - 3]}/${fileNameWithoutExtension}`;

        const fileContent = fs.readFileSync(fullPath, 'utf8');
        switch (fileExtension) {
            case 'mjml':
                template.mjml = fileContent;
                template.hbs = mjml2html(fileContent).html;
                break;
            case 'hbs':
                template.hbs = fileContent;
                break;
            default:
                console.log(`Warning: "pathToEmailTemplate" Will be ignored. Only .hbs and .mjml files are supported!`);
        }
        return Promise.resolve(template);
    } catch (error) {
        console.log('Something went wrong', path, error);
    }
};

const insertTemplate = async (dataSource: DataSource, emailTemplate: EmailTemplate) => {
    await dataSource.createQueryBuilder().insert().into(EmailTemplate).values(emailTemplate).execute();
};
