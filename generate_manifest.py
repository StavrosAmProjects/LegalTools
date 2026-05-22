import os
import json
import re

def parse_skill_md(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Improved frontmatter parsing
    frontmatter_match = re.search(r'^---(.*?)---', content, re.DOTALL)
    if frontmatter_match:
        data = {}
        lines = frontmatter_match.group(1).strip().split('\n')
        current_key = None
        for line in lines:
            if not line.strip():
                continue
            if ':' in line and not line.startswith(' '):
                key, value = line.split(':', 1)
                current_key = key.strip()
                data[current_key] = value.strip().strip('"').strip("'").replace('>-', '').strip()
            elif current_key and line.startswith(' '):
                # Handle multi-line values
                data[current_key] += ' ' + line.strip().strip('"').strip("'")
        return data

    return None

def generate_manifest():
    repo_root = '.'
    practice_areas = [
        'ai-governance-legal', 'commercial-legal', 'corporate-legal',
        'employment-legal', 'ip-legal', 'law-student', 'legal-builder-hub',
        'legal-clinic', 'litigation-legal', 'privacy-legal', 'product-legal',
        'regulatory-legal'
    ]

    manifest = {
        "practice_areas": []
    }

    for area in practice_areas:
        area_path = os.path.join(repo_root, area)
        if not os.path.isdir(area_path):
            continue

        area_data = {
            "id": area,
            "name": area.replace('-legal', '').replace('-', ' ').title(),
            "description": "",
            "skills": [],
            "agents": []
        }

        # Try to get area description from README.md
        readme_path = os.path.join(area_path, 'README.md')
        if os.path.exists(readme_path):
            with open(readme_path, 'r', encoding='utf-8') as f:
                first_line = f.readline().strip()
                if first_line.startswith('#'):
                    area_data["description"] = first_line.strip('#').strip()
                else:
                    area_data["description"] = first_line

        # Skills
        skills_path = os.path.join(area_path, 'skills')
        if os.path.isdir(skills_path):
            for skill_dir in sorted(os.listdir(skills_path)):
                skill_md_path = os.path.join(skills_path, skill_dir, 'SKILL.md')
                if os.path.exists(skill_md_path):
                    skill_info = parse_skill_md(skill_md_path)
                    if skill_info:
                        skill_info['id'] = skill_dir
                        # Fallback for name
                        skill_name = skill_info.get('name', skill_dir)
                        skill_info['command'] = f"/{area}:{skill_name}"
                        area_data["skills"].append(skill_info)

        # Agents
        agents_path = os.path.join(area_path, 'agents')
        if os.path.isdir(agents_path):
            for agent_file in sorted(os.listdir(agents_path)):
                if agent_file.endswith('.md'):
                    area_data["agents"].append({
                        "id": agent_file.replace('.md', ''),
                        "name": agent_file.replace('.md', '').replace('-', ' ').title(),
                        "path": os.path.join(area, 'agents', agent_file)
                    })

        manifest["practice_areas"].append(area_data)

    with open('launched/src/manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)

if __name__ == "__main__":
    generate_manifest()
