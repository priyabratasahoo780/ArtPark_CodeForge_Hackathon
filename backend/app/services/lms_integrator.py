import json
import zipfile
import io
from typing import Dict, Any

class LMSIntegrator:
    def __init__(self):
        pass

    def generate_scorm_package(self, learning_path: Dict[str, Any]) -> bytes:
        """
        Generates a SCORM 1.2 compliant ZIP package for the learning path.
        """
        buffer = io.BytesIO()
        
        with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as scorm_zip:
            # 1. Add imsmanifest.xml
            manifest = self._build_manifest(learning_path)
            scorm_zip.writestr('imsmanifest.xml', manifest)
            
            # 2. Add a simple launch page (index.html)
            index_html = self._build_index_html(learning_path)
            scorm_zip.writestr('index.html', index_html)
            
            # 3. Add SCORM API Wrapper (Simplified)
            scorm_zip.writestr('scorm_api.js', "// SCORM API Wrapper Mock\nfunction finish() { console.log('SCORM Finished'); }")

        return buffer.getvalue()

    def _build_manifest(self, learning_path: Dict[str, Any]) -> str:
        title = learning_path.get('goal', 'Personalized Learning Path')
        modules = learning_path.get('modules', [])
        
        items_xml = ""
        for i, module in enumerate(modules):
            items_xml += f"""
            <item identifier="item_{i}" identifierref="res_{i}">
                <title>{module.get('name', f'Module {i+1}')}</title>
            </item>"""

        resources_xml = ""
        for i, module in enumerate(modules):
            resources_xml += f"""
            <resource identifier="res_{i}" type="webcontent" adlcp:scormtype="sco" href="index.html?module={i}">
                <file href="index.html"/>
            </resource>"""

        return f"""<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="OnboardingEngine_SCORM" version="1.1"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p1p2 adlcp_rootv1p1p2.xsd">
    <metadata>
        <schema>ADL SCORM</schema>
        <schemaversion>1.2</schemaversion>
    </metadata>
    <organizations default="B0">
        <organization identifier="B0">
            <title>{title}</title>
            {items_xml}
        </organization>
    </organizations>
    <resources>
        {resources_xml}
    </resources>
</manifest>"""

    def _build_index_html(self, learning_path: Dict[str, Any]) -> str:
        title = learning_path.get('goal', 'Personalized Roadmap')
        modules_json = json.dumps(learning_path.get('modules', []), indent=2)
        
        return f"""<!DOCTYPE html>
<html>
<head>
    <title>{title}</title>
    <style>
        body {{ font-family: sans-serif; padding: 20px; background: #0f172a; color: white; }}
        .module {{ border: 1px solid #334155; padding: 15px; margin-bottom: 10px; border-radius: 8px; }}
        h1 {{ color: #00f3ff; }}
    </style>
</head>
<body>
    <h1>{title}</h1>
    <div id="content"></div>
    <script>
        const modules = {modules_json};
        const container = document.getElementById('content');
        modules.forEach(m => {{
            const div = document.createElement('div');
            div.className = 'module';
            div.innerHTML = `<h3>${{m.name}}</h3><p>${{m.description || ''}}</p>`;
            container.appendChild(div);
        }});
    </script>
</body>
</html>"""
