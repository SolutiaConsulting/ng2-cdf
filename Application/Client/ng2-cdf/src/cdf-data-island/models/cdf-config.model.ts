import { CdfConfigModelInterface }  from './cdf-config.interface';

export class CdfConfigModel implements CdfConfigModelInterface
{
	Domain: string;
	ApplicationKey: string;
	ScopeList?: string[]
}